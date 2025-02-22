import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  List,
  Card,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import { useDealFlow } from '../Shared/DealFlowContext';
import DocusignSignerRow from './DocusignSignerRow';

export interface SigningParticipant {
  name: string;
  email: string;
  routingOrder: string;
  status: DocusignStatus;
  role: string;
  recipientId: string;
  dateSigned?: string;
}

export enum DocusignStatus {
  CREATED = 'created',
  SENT = 'sent',
  DELIVERED = 'delivered',
  SIGNED = 'signed',
  DECLINED = 'declined',
  COMPLETED = 'completed',
  FAX_PENDING = 'faxpending',
  AUTO_RESPONDED = 'autoresponded',
}

const ReviewingInvestment = () => {
  const router = useRouter();
  const { deal } = useDealFlow();
  const [signingStatus, setSigningStatus] = useState<SigningParticipant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSigningStatus = async () => {
      if (!deal?.DocusignEvent?.length) {
        setLoading(false);
        return;
      }

      const latestEvent = deal.DocusignEvent[deal.DocusignEvent.length - 1];
      if (!latestEvent) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/docusign/signingOrder?envelopeId=${latestEvent.envelopeId}`
        );
        const data: SigningParticipant[] = await response.json();
        setSigningStatus(data);
      } catch (error) {
        console.error('Error fetching signing status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSigningStatus();
  }, [deal]);

  const renderSigningStatus = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <List sx={{ width: '100%', mt: 2 }}>
        {signingStatus.map((signer, index) => (
          <DocusignSignerRow
            key={signer.recipientId}
            signer={signer}
            isLast={index === signingStatus.length - 1}
          />
        ))}
      </List>
    );
  };

  const handleGoToDashboard = () => router.push('/dashboard');

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="We're Reviewing Your Documents" />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        You&apos;ll hear from our team shortly about transferring the funds.
        After that, we&apos;ll keep you posted regularly about construction
        progress, investment updates, and more.
      </Typography>

      <Card
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 500, color: '#000000DE', mb: 3 }}
          >
            Waiting for Signatures
          </Typography>

          <Typography variant="body2">
            Check the status of your agreement:
          </Typography>

          {renderSigningStatus()}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGoToDashboard}
              sx={{
                borderRadius: 28,
                py: 1.5,
                px: 4,
                textTransform: 'uppercase',
                fontWeight: 'bold',
                width: '100%',
                bgcolor: '#000',
                '&:hover': { bgcolor: '#333' },
              }}
            >
              GO TO DASHBOARD
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ReviewingInvestment;
