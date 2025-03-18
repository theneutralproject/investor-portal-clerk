// TODO: Fully hook up verification submission to the backend and ensure that no partial verifier information is submitted
import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import DealFlowFooter from '@components/DealFlow/Shared/DealFlowFooter';
import AccreditationQuestion from '@/components/DealFlow/Details/VerifyAccreditation/AccreditationQuestion';
import UploadDocumentContent from '@/components/DealFlow/Details/VerifyAccreditation/UploadDocumentContent';
import ThirdPartyVerifierForm from '@/components/DealFlow/Details/VerifyAccreditation/ThirdPartyVerifierForm';
import { questions } from '@/components/DealFlow/Helpers/types';
import {
  VerificationBasis,
  VerificationMethod,
  type AccreditationVerifier,
} from '@prisma/client';
import type { AccreditationVerificationCreateSchema } from '@/libs/accreditationVerification/schema';
import DealFlowTitle from '../../Shared/DealFlowTitle';
import { MODAL_KEYS } from '../../Shared/Modal/DealFlowLearnMoreModal';
import { sendGTMEvent } from '@next/third-parties/google';

const DealFlowVerifyAccreditation: React.FC = () => {
  const router = useRouter();
  const { deal, project, createVerification } = useDealFlow();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(
    'accreditation'
  );
  const [verifierInfo, setVerifierInfo] = useState<
    Partial<AccreditationVerifier>
  >({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    title: '',
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isThirdPartyVerifierValid = useMemo(() => {
    if (answers.verification !== 'Contact Third Party Verifier') {
      return true;
    }

    return Boolean(
      verifierInfo.firstName?.trim() &&
        verifierInfo.lastName?.trim() &&
        verifierInfo.email?.trim()
    );
  }, [
    answers.verification,
    verifierInfo.firstName,
    verifierInfo.lastName,
    verifierInfo.email,
  ]);

  const handleOptionChange = useCallback(
    (questionId: string, value: string) => {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
      setExpandedQuestion(
        questionId === 'accreditation' ? 'verification' : null
      );
    },
    []
  );

  const handleToggleAccordion = useCallback((questionId: string) => {
    setExpandedQuestion(prev => (prev === questionId ? null : questionId));
  }, []);

  const handleVerifierInfoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setVerifierInfo(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmitVerifier = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!deal) {
        throw new Error('Deal not found');
      }

      const method =
        answers.verification === 'Upload Document'
          ? VerificationMethod.SELF
          : VerificationMethod.THIRD_PARTY;

      const basis = answers.accreditation
        ?.toLowerCase()
        .includes('income of at least')
        ? VerificationBasis.INCOME
        : answers.accreditation?.toLowerCase().includes('verifiable net worth')
          ? VerificationBasis.ASSETS
          : answers.accreditation
                ?.toLowerCase()
                .includes('professional license')
            ? VerificationBasis.LICENSE
            : VerificationBasis.OTHER;
      const data = {
        dealId: deal.id,
        method,
        basis,
      } as AccreditationVerificationCreateSchema;
      if (verifierInfo) {
        data.verifier = {
          email: verifierInfo?.email ?? '',
          firstName: verifierInfo?.firstName ?? '',
          lastName: verifierInfo?.lastName ?? '',
          phoneNumber: verifierInfo?.phoneNumber ?? undefined,
          title: verifierInfo?.title ?? undefined,
        };
      }

      await createVerification(data);
      sendGTMEvent({
        dealId: deal.id,
        dealStage: deal.dealStage,
        eventCategory: 'Deal Flow',
        event: `Step 5: Accreditation Verification`,
        eventLabel: `Accreditation Basis: ${data.basis}| Method: ${data.method}`,
      });
    } catch (err) {
      setError('Failed to submit verifier information. Please try again.');
      console.error('Error submitting verifier:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (Object.keys(answers).length === 2) {
      if (answers.verification === 'Contact Third Party Verifier') {
        void handleSubmitVerifier();
      }

      router.push(`/dealflow/${project?.slug}/${deal?.id}/review`);
    }
  };

  const renderVerificationContent = useCallback(() => {
    const accreditationType = answers.accreditation;
    const verificationType = answers.verification;

    if (verificationType === 'Upload Document') {
      return (
        <UploadDocumentContent accreditationType={accreditationType ?? ''} />
      );
    } else if (verificationType === 'Contact Third Party Verifier') {
      return (
        <ThirdPartyVerifierForm
          verifierInfo={verifierInfo}
          onChange={handleVerifierInfoChange}
          error={error}
        />
      );
    }

    return null;
  }, [
    answers.accreditation,
    answers.verification,
    verifierInfo,
    handleVerifierInfoChange,
    error,
  ]);

  const visibleQuestions = useMemo(() => {
    const result = [];
    for (const question of questions) {
      if (result.length === 0 || answers[result[result.length - 1]?.id ?? '']) {
        result.push(question);
      } else {
        break;
      }
    }
    return result;
  }, [answers]);

  // Check if document is uploaded when "Upload Document" is selected
  const isDocumentValid = useMemo(() => {
    if (answers.verification !== 'Upload Document') {
      return true;
    }

    return deal?.document?.length >= 1;
  }, [answers.verification, deal?.document]);

  // Combined validation for the continue button
  const isContinueDisabled = useMemo(() => {
    const hasRequiredAnswers = Object.keys(answers).length === 2;

    return (
      !hasRequiredAnswers || !isThirdPartyVerifierValid || !isDocumentValid
    );
  }, [answers, isThirdPartyVerifierValid, isDocumentValid]);

  return (
    <Box>
      <DealFlowTitle
        title="Accreditation Verification"
        modalKey={MODAL_KEYS.VERIFY_ACCREDITATION}
      />
      {visibleQuestions.map(question => (
        <AccreditationQuestion
          key={question.id}
          question={question}
          answer={answers[question.id] ?? ''}
          onChange={handleOptionChange}
          expanded={expandedQuestion === question.id}
          onToggle={handleToggleAccordion}
        />
      ))}

      {answers.accreditation && answers.verification && (
        <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Verification Details
          </Typography>
          {renderVerificationContent()}
        </Box>
      )}

      <DealFlowFooter
        onContinue={handleContinue}
        isContinueDisabled={isContinueDisabled}
      />
    </Box>
  );
};

export default DealFlowVerifyAccreditation;
