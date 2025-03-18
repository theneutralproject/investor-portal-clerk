import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Card, List } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import { useUser } from '@clerk/nextjs';
import DealFlowFooter from '../Shared/DealFlowFooter';
import DocumentItem from '@components/DealFlow/ReviewSign/DocumentItem';
import ReviewingInvestment from '@components/DealFlow/ReviewSign/ReviewingInvestment';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import { createDocusignEnvelope } from '@components/DealFlow/Helpers/DealFlowHelpers';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { DealStage } from '@/libs/deal/schema';
import Logger from '@/libs/logger';
import { sendGTMEvent } from '@next/third-parties/google';
const DealFlowReview: React.FC = () => {
  const { project, deal, updateDeal, refetchDeal } = useDealFlow();
  const [docsLoading, setDocsLoading] = useState({});
  const { user } = useUser();
  const hasRunRef = useRef(false);
  const router = useRouter();
  useEffect(() => {
    //Make sure dealStage is 2 when on /review
    const updateDealStage = async () => {
      if (!hasRunRef.current && deal && deal.dealStage < 2) {
        hasRunRef.current = true;
        await updateDeal(
          {
            ...deal,
            dealStage: DealStage.DETAILS_SUBMITTED,
          },
          false
        );
      }
    };

    void updateDealStage();
  }, [deal, updateDeal]); // Include deal in dependencies to wait for it to be valid

  const docusignDocuments =
    project?.documents?.filter(doc => doc.documentType === 'DOCUSIGN') || [];

  const handleSignDocument = async (templateId: string) => {
    if (templateId && deal?.id) {
      setDocsLoading(prev => ({ ...prev, [templateId]: true }));
      toast.success('Generating document...');
      const res = await createDocusignEnvelope(templateId, deal.id, user);

      //Correct path if we get a response to show the user
      if (res.url && res.url.length > 0) {
        window.location.assign(res.url);
      } else {
        Logger.error(res.message, null, {
          message: 'DealFlowReview error:',
          templateId,
          dealId: deal.id,
        });
        toast.error(res.message);
      }
      setDocsLoading(prev => ({ ...prev, [templateId]: false }));
    }
  };

  const toReviewScreen = async () => {
    if (!deal) return;

    await updateDeal(
      {
        ...deal,
        dealStage: DealStage.DOCUMENT_REVIEW,
      },
      false
    );
    await refetchDeal();
    sendGTMEvent({
      event: 'customEvent',
      dealId: deal.id,
      dealStage: deal.dealStage,
      eventCategory: 'Deal Flow',
      eventAction: `Step 6: Investor Signature`,
      eventLabel: `Subscription Agreement Signed by Investor`,
    });
  };

  if (deal.dealStage === DealStage.DOCUMENT_REVIEW) {
    return <ReviewingInvestment />;
  }
  // Redirect to /fund if dealStage is >= 4
  if (deal.dealStage >= DealStage.SIGNATURES_COMPLETED) {
    router.push(`/dealflow/${project?.slug}/${deal.id}/fund`);
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="Review and Sign Documents" />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Once signed, our team will review and countersign these documents to
        finalize your investment.
      </Typography>

      <Card variant="outlined">
        <List disablePadding>
          {docusignDocuments.map((doc, index) => {
            if (!doc.docusignTemplateId) return null;
            const isLoading =
              docsLoading[doc.docusignTemplateId as keyof typeof docsLoading] ??
              false;
            return (
              <DocumentItem
                key={doc.id}
                title={doc.name}
                fileName={doc.fileName}
                // @ts-expect-error -- type completed
                isCompleted={doc.completed}
                isLoading={isLoading}
                handleClick={() => handleSignDocument(doc.docusignTemplateId!)}
                index={index + 1}
              />
            );
          })}
        </List>
      </Card>

      <DealFlowFooter
        onContinue={toReviewScreen}
        // @ts-expect-error -- type completed

        isContinueDisabled={!docusignDocuments.every(doc => doc.completed)}
      />
    </Box>
  );
};

export default DealFlowReview;
