import React, { useState, useCallback, useEffect } from 'react';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import DealFlowFooter from '@components/DealFlow/Shared/DealFlowFooter';
import CoInvestorCard from '@components/DealFlow/Details/CoInvestorCard';
import { useRouter } from 'next/navigation';
import { MembershipType, Role, type User } from '@prisma/client';
import {
  type UserCreateSchema,
  type UserUpdateSchema,
} from '@/libs/user/schema';
import type {
  MemberWithPartialUser,
  MemberWithUser,
  OrganizationWithMembersAndDeals,
  OrganizationWithDocuments,
} from '@/libs/types';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import { EncryptionCard } from './EncryptionCard';
import { MODAL_KEYS } from '../Shared/Modal/DealFlowLearnMoreModal';
import { DealStage } from '@/libs/deal/schema';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
export const LockedEntityAlert = () => {
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Alert
        severity="info"
        icon={<InfoIcon />}
        sx={{
          backgroundColor: '#f5f9ff',
          '& .MuiAlert-icon': {
            color: '#1976d2',
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>Entity details locked</AlertTitle>
        You cannot edit entity details used in an existing investment. To make
        changes, return to the preview screen and create a new investment
        entity.
      </Alert>
    </Box>
  );
};

// Checks if the organization is read only by checking if the organization has completed deals
export const isOrganizationReadOnly = (
  organizationsOwned: OrganizationWithMembersAndDeals[],
  currentOrganization: OrganizationWithDocuments
) => {
  if (!currentOrganization || !organizationsOwned) return false;

  const organizationWithDeals = organizationsOwned?.find(
    org => org.id === currentOrganization.id
  );

  const completedDeals = organizationWithDeals?.deals?.filter(
    deal => deal.dealStage === DealStage.CLOSED
  );
  if (!completedDeals) return false;

  return completedDeals.length > 0;
};

const DealFlowCoInvestor: React.FC = () => {
  const {
    deal,
    project,
    organization,
    createOrganizationMember,
    updateOrganizationMember,
    deleteOrganizationMember,
    organizationsOwned,
  } = useDealFlow();
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [localMembers, setLocalMembers] = useState<
    Partial<MemberWithPartialUser>[]
  >([]);
  const [dirtyCards, setDirtyCards] = useState<number[]>([]);
  const router = useRouter();

  const organizationReadOnly = isOrganizationReadOnly(
    organizationsOwned,
    organization
  );

  useEffect(() => {
    if (organization?.members) {
      setLocalMembers(organization.members);
    }
  }, [organization?.members]);

  const handleAddCoInvestor = useCallback(() => {
    const newMember: Partial<MemberWithPartialUser> = {
      type: MembershipType.COINVESTOR,
      title: '',
      user: {
        role: Role.USER,
        email: '',
        firstName: '',
        lastName: '',
      },
    };

    setLocalMembers(prev => [...prev, newMember]);
    setExpandedCards(prev => [...prev, localMembers.length]);
  }, [localMembers.length]);

  const handleCoInvestorChange = useCallback(
    (index: number, field: keyof User | 'title', value: string) => {
      setLocalMembers(prevMembers => {
        if (!prevMembers) return prevMembers;
        return prevMembers.map((member, i) =>
          i === index
            ? {
                ...member,
                ...(field === 'title'
                  ? { title: value }
                  : {
                      user: { ...member.user, [field]: value } as Partial<User>,
                    }),
              }
            : member
        );
      });
    },
    []
  );

  const handleDirtyChange = useCallback((index: number, isDirty: boolean) => {
    setDirtyCards(prev => {
      if (isDirty && !prev.includes(index)) {
        return [...prev, index];
      } else if (!isDirty && prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return prev;
    });
  }, []);

  const nextRoute = useCallback(() => {
    if (project?.slug && deal?.id) {
      router.push(`/dealflow/${project.slug}/${deal.id}/verify-accreditation`);
    }
  }, [project, deal, router]);

  const handleSaveCoInvestor = useCallback(
    async (index: number) => {
      if (!deal) return;

      const coInvestor = localMembers[index];
      if (!coInvestor?.user) {
        console.error('Co-investor user data is missing');
        return;
      }

      try {
        if (coInvestor.id) {
          // Update existing member
          await updateOrganizationMember(coInvestor.id, {
            dealId: deal.id,
            user: coInvestor.user as UserUpdateSchema,
            title: coInvestor.title ?? '',
            type: MembershipType.COINVESTOR,
          });
        } else {
          // Create new member
          await createOrganizationMember({
            dealId: deal.id,
            user: coInvestor.user as UserCreateSchema,
            title: coInvestor.title ?? '',
            type: MembershipType.COINVESTOR,
          });
        }
        setExpandedCards(prev => prev.filter(i => i !== index));
      } catch (error) {
        console.error('Error saving co-investor:', error);
      }
    },
    [deal, localMembers, createOrganizationMember, updateOrganizationMember]
  );

  const handleCancelCoInvestor = useCallback(
    (index: number) => {
      setExpandedCards(prev => prev.filter(i => i !== index));

      // If the member has no ID (newly added), remove it from localMembers
      const member = localMembers[index];
      if (!member?.id) {
        setLocalMembers(prev => prev.filter((_, i) => i !== index));
      }
    },
    [localMembers]
  );

  const handleExpandCard = useCallback((index: number) => {
    setExpandedCards(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }, []);

  if (!organization || !deal) return null;

  return (
    <Box>
      <DealFlowTitle
        title="Add Co-Investors"
        modalKey={MODAL_KEYS.ADD_CO_INVESTORS}
      />

      {organizationReadOnly && <LockedEntityAlert />}

      {localMembers.map((coInvestor, index) => (
        <CoInvestorCard
          key={`${coInvestor.id ?? index}`}
          coInvestor={coInvestor as MemberWithUser}
          index={index}
          onSave={handleSaveCoInvestor}
          onCancel={handleCancelCoInvestor}
          onChange={handleCoInvestorChange}
          expanded={expandedCards.includes(index)}
          onExpand={handleExpandCard}
          deleteOrganizationMember={deleteOrganizationMember}
          organizationReadOnly={organizationReadOnly}
          onDirtyChange={handleDirtyChange}
        />
      ))}

      {expandedCards.length === 0 && !organizationReadOnly && (
        <Box mt={2}>
          <Button
            variant="grayPill"
            startIcon={<span>+</span>}
            onClick={handleAddCoInvestor}
          >
            ADD CO-INVESTOR
          </Button>
        </Box>
      )}
      <EncryptionCard />
      {dirtyCards.length > 0 && (
        <Box
          mt={2}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            color: 'warning.main',
          }}
        >
          <WarningIcon fontSize="small" color="warning" />

          <Typography variant="body2" color={'warning.main'} sx={{ ml: 1 }}>
            You have {dirtyCards.length} co-investors that need to be saved.
          </Typography>
        </Box>
      )}

      <DealFlowFooter
        onContinue={nextRoute}
        onBack={() => router.back()}
        isContinueDisabled={dirtyCards.length > 0}
      />
    </Box>
  );
};

export default DealFlowCoInvestor;
