import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { MemberWithUser, OrganizationWithMembersAndDeals } from '@/libs/types';
import { useDealFlow } from '../Shared/DealFlowContext';
import DealFlowFooter from '../Shared/DealFlowFooter';
import DealFlowTitle from '../Shared/DealFlowTitle';
import { useRouter } from 'next/navigation';

const formatDate = (date: Date | null | undefined | string): string => {
  if (!date) return '';

  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date as Date;
  }

  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${month}/${day}/${year}`;
};

const MembersList = ({ members }: { members: MemberWithUser[] }) => (
  <List dense disablePadding sx={{ mt: 0.25 }}>
    {members.map(member => (
      <ListItem key={member.id} sx={{ py: 0.125 }}>
        <ListItemIcon sx={{ minWidth: 20 }}>
          <CircleIcon sx={{ fontSize: 4, color: '#00000099' }} />
        </ListItemIcon>
        <ListItemText
          primary={`${member.user.firstName} ${member.user.lastName}`}
          slotProps={{ primary: { sx: { color: '#00000099' } } }}
        />
      </ListItem>
    ))}
  </List>
);

const OrganizationCard = ({
  org,
  isSelected,
  onSelect,
}: {
  org: OrganizationWithMembersAndDeals;
  isSelected: boolean;
  onSelect: (id: number) => void;
}) => (
  <Card
    sx={{
      cursor: 'pointer',
      border: isSelected ? '2px solid #1976d2' : 'none',
    }}
    onClick={() => onSelect(org.id)}
  >
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Radio checked={isSelected} sx={{ p: 1 }} />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="div">
              {org.name}
            </Typography>
            <Chip
              label={
                org.ownershipType.charAt(0) +
                org.ownershipType.slice(1).toLowerCase()
              }
              size="small"
              sx={{
                backgroundColor: 'grey.100',
                fontWeight: 500,
              }}
            />
          </Box>
          {org.dateOfCreation && (
            <Typography variant="body2" color="text.secondary">
              Date created: {formatDate(org.dateOfCreation)}
            </Typography>
          )}
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        MEMBERS
      </Typography>
      <MembersList members={org.members} />
    </CardContent>
  </Card>
);

const DealFlowDetailsExistingEntity = () => {
  const { organizationsOwned, organization, deal, project, updateDeal } =
    useDealFlow();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number>(
    organization.id ?? -1
  );
  const router = useRouter();

  const handleContinue = async () => {
    const org = organizationsOwned.find(
      org => org.id === selectedOrganizationId
    );
    if (org) {
      await updateDeal({
        ...deal,
        organizationId: org.id,
        investmentStats: {
          ...deal.investmentStats,
          ownershipType: org.ownershipType,
        },
      });
    }

    //New entity is normal flow
    if (selectedOrganizationId === -1) {
      router.push(
        `/dealflow/${project?.slug}/${deal?.id}/details-ownership-type`
      );
    }
  };

  return (
    <Box>
      <DealFlowTitle title="Investment Details" />
      <Typography variant="body2" gutterBottom>
        Would you like to invest with one of your previous investment entities?
      </Typography>
      <Stack spacing={2}>
        {organizationsOwned.map(org => (
          <OrganizationCard
            key={org.id}
            org={org}
            isSelected={selectedOrganizationId === org.id}
            onSelect={setSelectedOrganizationId}
          />
        ))}

        <Card
          onClick={() => setSelectedOrganizationId(-1)}
          sx={{
            cursor: 'pointer',
            border:
              selectedOrganizationId === -1 ? '2px solid #1976d2' : 'none',
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Radio checked={selectedOrganizationId === -1} />
              <Typography variant="h6">Use a New Investment Entity</Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      <DealFlowFooter onContinue={handleContinue} />
    </Box>
  );
};

export default DealFlowDetailsExistingEntity;
