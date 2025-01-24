import { createDocumentEntry } from '@/libs/admin/utils';
import { toUTCMidnight, updateDeal } from '@/libs/deal/utils.server';
import {
  getEnvelopeAsPdfFileBuffer,
  instantiateApiClient,
  refreshAccessToken,
} from '@/libs/docusign/utils';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils';
import { DocumentType, DealDocumentType } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { storageClient } from '@/libs/supabase';

type DocusignWebhookPayload = {
  event: string;
  uri: string;
  generatedDateTime: string;
  data: {
    envelopeId: string;
    emailSubject: string;
  };
};

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

  if (payload.event === 'recipient-completed') {
    // update dealEvent
    try {
      await prisma.docusignEvent.update({
        where: { envelopeId: payload.data.envelopeId },
        data: {
          investorSignatureCompleted: true,
        },
      });
      return jsonResponse({
        message: `Docusign webhook processed for envelopeId ${payload.data.envelopeId}`,
      });
    } catch (__error) {
      console.warn(
        `Failed to update docusign event 1 for envelopeId ${payload.data.envelopeId}`
      );
      console.warn(
        `The envelopeId ${payload.data.envelopeId} does not exist in the database and can be ignored.`
      );
      return jsonResponse({
        message: `Failed to update docusign event recipient-completed for envelopeId ${payload.data.envelopeId}`,
      });
    }
  } else if (payload.event === 'envelope-completed') {
    // update dealEvent
    const dealEvent = await prisma.docusignEvent.update({
      where: { envelopeId: payload.data.envelopeId },
      data: {
        dateCompleted: new Date(),
        allSignaturesCompleted: true,
      },
      include: {
        deal: { include: { investmentStats: true } },
        user: true,
      },
    });
    if (!dealEvent) {
      console.warn('Failed to update docusign event 2');
      console.warn(
        `The envelopeId ${payload.data.envelopeId} does not exist in the database and can be ignored.`
      );
      return jsonResponse({
        message: `Failed to update docusign event envelope-completed for envelopeId ${payload.data.envelopeId}`,
      });
    }
    const { deal, user } = dealEvent;
    if (!deal.investmentStats) {
      console.error(
        `Deal with id ${deal.id} has no investment stats and cannot be updated`
      );
      return errorResponse(
        `Deal with id ${deal.id} has no investment stats and cannot be updated`,
        500
      );
    }

    // check if all envelopes for this deal are completed
    // get documents
    const dealDocuments = await prisma.projectDocument.findMany({
      where: {
        projectId: deal.projectId,
        financingTypes: { has: deal.investmentStats.financingType },
        documentType: DocumentType.DOCUSIGN,
      },
      include: { project: { select: { slug: true, id: true } } },
    });

    // get docusignevents
    const dealEvents = await prisma.docusignEvent.findMany({
      where: { dealId: deal.id, allSignaturesCompleted: true },
    });

    if (dealEvents.length >= dealDocuments.length && dealDocuments.length > 0) {
      console.log('All documents signed for deal', deal.id);
      // update deal and hubspot
      const dealData = {
        hubspotId: deal.hubspotId,
        // store as date at UTC midnight
        signaturesCompletedDate: toUTCMidnight(
          dealEvent.dateCompleted ?? new Date()
        ),
        dealStage: 4,
      };
      await updateDeal(dealData, true);

      // get documentName from projectdocs
      const projectDoc = await prisma.projectDocument.findFirst({
        where: {
          docusignTemplateId: dealEvent.templateId,
        },
      });
      if (!projectDoc) {
        console.error(
          'Failed to find project document for templateId',
          dealEvent.templateId
        );
        return jsonResponse(
          {
            message: `Failed to find project document for templateId${dealEvent.templateId}`,
          },
          500
        );
      }
      let { fileName } = projectDoc;
      if (!fileName.toLowerCase().endsWith('.pdf')) {
        fileName += '.pdf';
      }
      const { slug } = dealDocuments[0]!.project;
      const accessTokenResponse = await refreshAccessToken(
        user.email,
        deal.id,
        slug
      );
      if (accessTokenResponse.consentUrl) {
        // we need to get consent from the user to share their data with docusign.
        // this should never happen as we already did this when the user signed the document
        console.error(
          'WEIRD: Consent required to share data with docusign for templateId:',
          dealEvent.templateId
        );
        return new Response(
          JSON.stringify({ consentUrl: accessTokenResponse.consentUrl }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const envelopesApi = await instantiateApiClient(
        accessTokenResponse.accessToken
      );
      const pdfFile = await getEnvelopeAsPdfFileBuffer(
        envelopesApi,
        payload.data.envelopeId,
        fileName
      );
      console.log('\n', pdfFile, '\n');
      // https://supabase.com/docs/reference/javascript/storage-from-upload
      const { data, error } = await storageClient
        .from('deal-documents')
        .upload(`deal-${deal.id}/${fileName}`, pdfFile);
      if (error) {
        console.error('Failed to upload pdf to storage:', error);
        return jsonResponse(
          { message: 'Failed to upload pdf to storage' },
          500
        );
      }
      // store the pdf in supabase storage
      const { path } = data;

      await createDocumentEntry(
        'deal',
        deal.id,
        fileName,
        path,
        '',
        parseInt(process.env.ADMIN_USER_ID!),
        DealDocumentType.INVESTMENT_DOCUMENT
      );
      return jsonResponse({ message: 'PDF successfully stored' });
    }

    return jsonResponse({ message: 'Docusign webhook received' });
  } else {
    console.log('Ignoring Docusign webhook:', payload.event);
    return jsonResponse({ message: 'Ignoring Docusign webhook' });
  }
}
