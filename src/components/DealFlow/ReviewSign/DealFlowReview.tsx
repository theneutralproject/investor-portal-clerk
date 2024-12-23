import React, { useEffect, useRef } from 'react';
import { Box, Typography, Card, List } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import { useUser } from '@clerk/nextjs';
import DealFlowFooter from '../Shared/DealFlowFooter';
import DocumentItem from '@components/DealFlow/ReviewSign/DocumentItem';
import ReviewingInvestment from '@components/DealFlow/ReviewSign/ReviewingInvestment';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import { createDocusignEnvelope } from '@components/DealFlow/Helpers/DealFlowHelpers';

const DealFlowReview: React.FC = () => {
  const { project, deal, updateDeal, refetchDeal } = useDealFlow();
  const { user } = useUser();
  const hasRunRef = useRef(false);

  useEffect(() => {
    //Make sure dealStage is 2 when on /review
    const updateDealStage = async () => {
      if (!hasRunRef.current && deal && deal.dealStage < 2) {
        hasRunRef.current = true;
        await updateDeal(
          {
            ...deal,
            dealStage: 2,
          },
          false
        );
      }
    };

    void updateDealStage();
  }, [deal, updateDeal]); // Include deal in dependencies to wait for it to be valid

  const docusignDocuments =
    project?.documents?.filter(doc => doc.documentType === 'DOCUSIGN') || [];

  const handleSignDocument = (templateId: string) => {
    if (templateId && deal?.id) {
      void createDocusignEnvelope(templateId, deal.id, user);
    }
  };

  const toReviewScreen = async () => {
    if (!deal) return;

    await updateDeal(
      {
        ...deal,
        dealStage: 3,
      },
      false
    );
    await refetchDeal();
  };

  if (deal.dealStage === 3) {
    return <ReviewingInvestment />;
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
          {docusignDocuments.map((doc, index) => (
            <DocumentItem
              key={doc.id}
              title={doc.name}
              fileName={doc.fileName}
              // @ts-expect-error -- type completed
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              isCompleted={doc.completed}
              onSign={() =>
                doc.docusignTemplateId &&
                handleSignDocument(doc.docusignTemplateId)
              }
              index={index + 1}
            />
          ))}
        </List>
      </Card>

      <DealFlowFooter
        onBack={() => null}
        onContinue={toReviewScreen}
        // @ts-expect-error -- type completed
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        isContinueDisabled={!docusignDocuments.every(doc => doc.completed)}
      />
    </Box>
  );
};

export default DealFlowReview;
