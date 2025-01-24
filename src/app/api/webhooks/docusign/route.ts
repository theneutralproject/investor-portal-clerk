import { createDocumentEntry } from '@/libs/admin/utils';
import { toUTCMidnight, updateDeal } from '@/libs/deal/utils.server';
import {
  getEnvelopeAsPdfFileBuffer,
  instantiateApiClient,
  refreshAccessToken,
} from '@/libs/docusign/utils';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils';
import {
  DocumentType,
  DealDocumentType,
  User,
  Deal,
  DocusignEvent,
} from '@prisma/client';
import type { NextRequest } from 'next/server';
import { storageClient } from '@/libs/supabase';
import { DealWithInvestmentStats } from '@/libs/types';
import { template } from 'lodash';

type DocusignWebhookPayload = {
  event: string;
  uri: string;
  generatedDateTime: string;
  data: {
    envelopeId: string;
    emailSubject: string;
  };
};

async function storeRecipientCompletedEvent(payload: DocusignWebhookPayload) {
  try {
    const updatedEvent = await prisma.docusignEvent.update({
      where: { envelopeId: payload.data.envelopeId },
      data: {
        investorSignatureCompleted: true,
      },
    });

    console.log(
      `Successfuly updated docusign event ${updatedEvent.id} due to "recipient-completed" webhook`
    );
    return {
      message: `Docusign webhook processed for envelopeId ${payload.data.envelopeId}`,
    };
  } catch (__error) {
    console.warn(
      `Failed to update docusign event 1 for envelopeId ${payload.data.envelopeId}`
    );
    console.warn(
      `The envelopeId ${payload.data.envelopeId} does not exist in the database and can be ignored.`
    );
    return {
      message: `Failed to update docusign event recipient-completed for envelopeId ${payload.data.envelopeId}`,
    };
  }
}

// break this out into a function
async function allEnvelopesAreCompleted(deal: DealWithInvestmentStats) {
  const projectDocusignDocs = await prisma.projectDocument.findMany({
    where: {
      projectId: deal.projectId,
      financingTypes: { has: deal.investmentStats.financingType },
      documentType: DocumentType.DOCUSIGN,
    },
    include: { project: { select: { slug: true, id: true } } },
  });

  const dealEvents = await prisma.docusignEvent.findMany({
    where: { dealId: deal.id, allSignaturesCompleted: true },
  });

  return dealEvents.length >= projectDocusignDocs.length;
}

async function fetchAndStoreCompletedPdfFromDocusign(
  docusignEvent: DocusignEvent,
  slug: string,
  user: User,
  deal: Deal
) {
  const { envelopeId, templateId } = docusignEvent;
  // get documentName from projectdocs
  const projectDoc = await prisma.projectDocument.findFirst({
    where: {
      docusignTemplateId: templateId,
    },
  });
  if (!projectDoc) {
    const errorMessage = `Failed to find project document for templateId ${templateId}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  let { fileName } = projectDoc;
  if (!fileName.toLowerCase().endsWith('.pdf')) {
    fileName += '.pdf';
  }

  const accessTokenResponse = await refreshAccessToken(
    user.email,
    deal.id,
    slug
  );
  if (accessTokenResponse.consentUrl) {
    // we need to get consent from the user to share their data with docusign.
    // this should never happen as we already did this when the user signed the document
    const errorMessage = `Consent required to share data with docusign for templateId: ${templateId} - THIS SHOULD NEVER HAPPEN!`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const envelopesApi = await instantiateApiClient(
    accessTokenResponse.accessToken
  );
  const pdfFile = await getEnvelopeAsPdfFileBuffer(
    envelopesApi,
    envelopeId,
    fileName
  );
  console.log('\n', pdfFile, '\n');
  // https://supabase.com/docs/reference/javascript/storage-from-upload
  const { data, error } = await storageClient
    .from('deal-documents')
    .upload(`deal-${deal.id}/${fileName}`, pdfFile);
  if (error) {
    console.error('Failed to upload pdf to storage:', error);
    return jsonResponse({ message: 'Failed to upload pdf to storage' }, 500);
  }
  // store the pdf in supabase storage
  const { path } = data;

  return await createDocumentEntry(
    'deal',
    deal.id,
    fileName,
    path,
    '',
    parseInt(process.env.ADMIN_USER_ID!),
    DealDocumentType.INVESTMENT_DOCUMENT
  );
}

async function handleEnvelopeCompletedEvent(payload: DocusignWebhookPayload) {
  // this means that all parties have signed the one envelope. We need to check if all envelopes for this deal have been signed to advance the dealstage
  console.log('Updating docusign event due to "envelope-completed" webhook');
  let deal: DealWithInvestmentStats | null = null;
  let user: User | null = null;
  let updatedDealEvent: DocusignEvent | null = null;
  let slug: string | null = null;
  try {
    const tempDealEvent = await prisma.docusignEvent.update({
      where: { envelopeId: payload.data.envelopeId },
      data: {
        dateCompleted: new Date(),
        allSignaturesCompleted: true,
      },
      include: {
        deal: {
          include: {
            investmentStats: true,
            project: { select: { slug: true, id: true } },
          },
        },
        user: true,
      },
    });

    if (!tempDealEvent) {
      const message = `Failed to update docusign event envelope-completed for envelopeId ${payload.data.envelopeId}`;
      console.error(message);
      throw new Error(message);
    }

    user = tempDealEvent.user;
    updatedDealEvent = tempDealEvent;
    const tempDeal = tempDealEvent.deal;
    const investmentStats = tempDeal.investmentStats;
    slug = tempDeal.project.slug;
    deal = tempDeal as DealWithInvestmentStats;
    if (investmentStats) {
      deal.investmentStats = investmentStats;
    } else {
      throw new Error(
        `Deal with id ${tempDeal.id} has no investment stats and cannot be updated`
      );
    }
  } catch (error) {
    console.error(
      `Failed to update docusign event envelope-completed for envelopeId ${payload.data.envelopeId}`
    );
    throw error;
  }
  const allCompleted = await allEnvelopesAreCompleted(deal);
  try {
    if (allCompleted) {
      console.log(
        `All documents signed for deal ${deal.id} - progressing to stage 4`
      );
      // update deal and hubspot
      const dealData = {
        hubspotId: deal.hubspotId,
        // store as date at UTC midnight
        signaturesCompletedDate: toUTCMidnight(
          updatedDealEvent.dateCompleted ?? new Date()
        ),
        dealStage: 4,
      };
      await updateDeal(dealData, true);
      await fetchAndStoreCompletedPdfFromDocusign(
        updatedDealEvent,
        slug,
        user,
        deal
      );
      const successMessage = `Dealstage advanced to 4 and signed PDF successfully stored for deal ${deal.id}`;
      console.log(successMessage);

      return jsonResponse({ message: successMessage });
    }
  } catch (error) {
    console.error(`Failed to update dealstage for deal ${deal.id}`);
    throw error;
  }

  return jsonResponse({
    message: `Docusign webhook processes for deal ${deal.id}`,
  });
}

/**
 * This webhook is called by DocuSign when a signature or an envelope is completed.
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  const payload = (await req.json()) as DocusignWebhookPayload;

  const existingEvent = await prisma.docusignEvent.findUnique({
    where: { envelopeId: payload.data.envelopeId },
  });
  if (!existingEvent) {
    console.warn(
      'Failed to find existing docusign event for envelopeId - this envelope was likely created outside of the investor portal and can be ignored',
      payload.data.envelopeId
    );
    console.log('Docusign Payload:', payload.data);
    return jsonResponse({
      message: `Failed to find existing docusign event for envelopeId ${payload.data.envelopeId}`,
    });
  }
  switch (payload.event) {
    case 'recipient-completed':
      return await storeRecipientCompletedEvent(payload);
    case 'envelope-completed':
      return await handleEnvelopeCompletedEvent(payload);
    default:
      console.log('Ignoring Docusign webhook:', payload.event);
      return jsonResponse({ message: 'Ignoring Docusign webhook' });
  }
}
