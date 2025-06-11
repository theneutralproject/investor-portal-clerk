/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Collapse,
  styled,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import { MembershipType, type User } from '@prisma/client';
import type { MemberWithUser } from '@/libs/types';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: 'none',
}));

const ExpandableHeader = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  padding: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface ExpandMoreProps extends React.HTMLAttributes<HTMLDivElement> {
  expand: boolean;
}

const ExpandMore = styled(({ expand, ...other }: ExpandMoreProps) => {
  const { onClick, ...rest } = other;
  return (
    <div {...rest} onClick={onClick}>
      <ExpandMoreIcon />
    </div>
  );
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface CoInvestorCardProps {
  coInvestor: MemberWithUser & {
    title: string | null;
    user: Partial<User>;
  };
  index: number;
  onSave: (index: number) => void;
  onCancel: (index: number) => void;
  onChange: (index: number, field: keyof User | 'title', value: string) => void;
  expanded: boolean;
  onExpand: (index: number) => void;
  deleteOrganizationMember?: (memberId: number) => void;
  organizationReadOnly: boolean;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

const CoInvestorCard: React.FC<CoInvestorCardProps> = ({
  coInvestor,
  index,
  onSave,
  onCancel,
  onChange,
  expanded,
  onExpand,
  deleteOrganizationMember,
  organizationReadOnly,
  onDirtyChange,
}) => {
  // Track which fields have been touched
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  // Track if the form is dirty (has unsaved changes)
  const [isDirty, setIsDirty] = useState(false);

  // Validation functions
  const isEmailValid = (email: string | null | undefined) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPhoneValid = (phone: string | null | undefined) => {
    if (!phone) return true;
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const isNameValid = (name: string | null | undefined) => {
    if (!name) return true;
    return name.trim().length >= 2;
  };

  const isTitleValid = (title: string | null | undefined) => {
    if (!title) return true;
    return title.trim().length >= 2;
  };

  // Check if all required fields are filled and valid
  const isFormValid = () => {
    const { firstName, lastName, email, phoneNumber } = coInvestor.user;
    const { title } = coInvestor;

    return (
      firstName?.trim() &&
      lastName?.trim() &&
      email?.trim() &&
      title?.trim() &&
      isEmailValid(email) &&
      isNameValid(firstName) &&
      isNameValid(lastName) &&
      isTitleValid(title) &&
      isPhoneValid(phoneNumber)
    );
  };

  const handleChange = (field: keyof User | 'title', value: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
    setIsDirty(true);
    if (onDirtyChange) {
      onDirtyChange(index, true);
    }
    onChange(index, field, value);
  };

  const isFieldTouched = (field: string) => touchedFields.has(field);

  const showError = (
    field: string,
    validationFn: (value: string | null | undefined) => boolean,
    value: string | null | undefined
  ) => {
    return isFieldTouched(field) && !validationFn(value);
  };

  const investorType = coInvestor.type === 'OWNER' ? 'Investor' : 'Co-Investor';
  const readOnly =
    coInvestor.type === MembershipType.OWNER || organizationReadOnly;
  const showDelete = coInvestor.id && deleteOrganizationMember && !readOnly;
  const isRegisteredUser =
    coInvestor?.user?.clerkId !== undefined && coInvestor.user.clerkId !== null;
  const userName =
    (coInvestor.user.firstName ?? coInvestor.user.lastName)
      ? `${coInvestor.user.firstName ?? ''} ${coInvestor.user.lastName ?? ''}`
      : `${investorType} ${index + 1}`;

  return (
    <StyledCard>
      <ExpandableHeader
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => {
          if (!readOnly) onExpand(index);
        }}
      >
        <Box>
          <Typography variant="overline" display="block" gutterBottom>
            {investorType}
            {isRegisteredUser && (
              <Tooltip title="Registered User">
                <VerifiedUserIcon
                  sx={{
                    ml: 1,
                    fontSize: '1rem',
                    verticalAlign: 'middle',
                    color: 'primary.main',
                  }}
                />
              </Tooltip>
            )}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {userName}
          </Typography>
          {isRegisteredUser && coInvestor.user.email && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
              {coInvestor.user.email}
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center">
          {isDirty && !expanded && (
            <Tooltip title="Unsaved changes">
              <WarningIcon color="warning" fontSize="small" sx={{ mr: 1 }} />
            </Tooltip>
          )}
          {showDelete && (
            <Tooltip title="Delete Member">
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                  if (deleteOrganizationMember && coInvestor.id) {
                    deleteOrganizationMember(coInvestor.id);
                  }
                }}
                size="small"
                sx={{ mr: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {!isRegisteredUser && (
            <ExpandMore
              expand={expanded}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                onExpand(index);
              }}
              aria-expanded={expanded}
              aria-label="show more"
            />
          )}
        </Box>
      </ExpandableHeader>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2}>
              <TextField
                variant="standard"
                label="First Name"
                value={coInvestor.user.firstName ?? ''}
                onChange={e => handleChange('firstName', e.target.value)}
                fullWidth
                disabled={readOnly || isRegisteredUser}
                error={showError(
                  'firstName',
                  isNameValid,
                  coInvestor.user.firstName
                )}
                helperText={
                  showError(
                    'firstName',
                    isNameValid,
                    coInvestor.user.firstName
                  ) && 'First name must be at least 2 characters'
                }
                required
              />
              <TextField
                variant="standard"
                label="Last Name"
                value={coInvestor.user.lastName ?? ''}
                onChange={e => handleChange('lastName', e.target.value)}
                fullWidth
                disabled={readOnly || isRegisteredUser}
                error={showError(
                  'lastName',
                  isNameValid,
                  coInvestor.user.lastName
                )}
                helperText={
                  showError(
                    'lastName',
                    isNameValid,
                    coInvestor.user.lastName
                  ) && 'Last name must be at least 2 characters'
                }
                required
              />
            </Box>
            <TextField
              variant="standard"
              label="Email"
              value={coInvestor.user.email ?? ''}
              onChange={e => handleChange('email', e.target.value)}
              fullWidth
              disabled={readOnly || isRegisteredUser}
              error={showError('email', isEmailValid, coInvestor.user.email)}
              helperText={
                showError('email', isEmailValid, coInvestor.user.email) &&
                'Please enter a valid email address'
              }
              required
            />
            <TextField
              variant="standard"
              label="Phone Number"
              value={coInvestor.user.phoneNumber ?? ''}
              onChange={e => handleChange('phoneNumber', e.target.value)}
              fullWidth
              disabled={readOnly || isRegisteredUser}
              error={showError(
                'phoneNumber',
                isPhoneValid,
                coInvestor.user.phoneNumber
              )}
              helperText={
                showError(
                  'phoneNumber',
                  isPhoneValid,
                  coInvestor.user.phoneNumber
                ) && 'Please enter a valid phone number'
              }
            />
            <TextField
              variant="standard"
              label="Title"
              value={coInvestor.title ?? ''}
              onChange={e => handleChange('title', e.target.value)}
              fullWidth
              disabled={readOnly || isRegisteredUser}
              error={showError('title', isTitleValid, coInvestor.title)}
              helperText={
                showError('title', isTitleValid, coInvestor.title) &&
                'Title must be at least 2 characters'
              }
              required
            />
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', mb: 1 }}>
          <Button
            variant="grayPill"
            onClick={() => {
              onCancel(index);
              setIsDirty(false);
              if (onDirtyChange) {
                onDirtyChange(index, false);
              }
            }}
            disabled={readOnly || isRegisteredUser}
          >
            Cancel
          </Button>
          <Button
            variant="blackPill"
            onClick={() => {
              onSave(index);
              setIsDirty(false);
              if (onDirtyChange) {
                onDirtyChange(index, false);
              }
            }}
            disabled={readOnly || isRegisteredUser || !isFormValid()}
          >
            Save {investorType}
          </Button>
        </CardActions>
      </Collapse>
    </StyledCard>
  );
};

export default CoInvestorCard;
