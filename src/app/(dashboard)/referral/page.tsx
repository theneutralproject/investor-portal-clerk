'use client';
import React, { useState, Suspense, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Container,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import {
  ReferralSource,
  ReferralCategory,
  REFERRAL_SOURCES,
  ReferralSourceItem,
} from '@/libs/hubspot/utils.client';
import { useRedirect } from '@/app/context/RedirectContext';
import { sendGTMEvent } from '@next/third-parties/google';

interface CategoryOptionProps {
  category: ReferralCategory;
  isExpanded: boolean;
  onToggle: () => void;
  sources: ReferralSourceItem[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const CategoryOption: React.FC<CategoryOptionProps> = ({
  category,
  isExpanded,
  onToggle,
  sources,
  selectedValue,
  onChange,
}) => {
  const formatCategoryTitle = (category: ReferralCategory): string => {
    switch (category) {
      case ReferralCategory.COMPANY_CHANNELS:
        return 'Company Channels';
      case ReferralCategory.NEWS_MEDIA:
        return 'News/Media';
      default:
        return category;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          py: 1,
          px: 1,
        }}
        onClick={onToggle}
      >
        <IconButton
          size="small"
          edge="start"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Typography sx={{ flexGrow: 1 }}>
          {formatCategoryTitle(category)}
        </Typography>
      </Box>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ pl: 4 }}>
          {sources.map(source => (
            <ListItem
              key={source.value}
              disablePadding
              disableGutters
              sx={{ my: 0.5 }}
            >
              <FormControlLabel
                value={source.value}
                control={<Radio />}
                label={source.name}
                sx={{ ml: 0 }}
                onChange={() => onChange(source.value)}
                checked={selectedValue === source.value}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

function ReferralForm(): JSX.Element {
  const [referralSource, setReferralSource] = useState<ReferralSource | ''>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    [ReferralCategory.COMPANY_CHANNELS]: false,
    [ReferralCategory.NEWS_MEDIA]: false,
  });
  const { user } = useUser();
  const { doRedirect } = useRedirect();

  const toggleCategory = (category: ReferralCategory): void => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const updateUserAndHubspot = async (
    source: ReferralSource
  ): Promise<void> => {
    const userId = user?.id ?? '';
    const emailAddress =
      user?.primaryEmailAddress?.emailAddress?.toString() ?? 'unknown';

    sendGTMEvent({
      userId,
      eventCategory: 'Account',
      event: 'Account Signup',
      eventLabel: `New Account Signup by ${emailAddress}`,
    });

    try {
      const email =
        user?.primaryEmailAddress?.emailAddress ??
        user?.emailAddresses?.[0]?.emailAddress;

      if (!email) {
        throw new Error('User email address not found');
      }

      await axios.put('/api/users', {
        email,
        properties: { referral_source: source },
        referralSource: source,
      });
    } catch (error) {
      console.error('Error updating user information:', error);
    }

    doRedirect({});
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!referralSource) return;

    setIsLoading(true);
    await updateUserAndHubspot(referralSource as ReferralSource);
  };

  const handleSkip = async (): Promise<void> => {
    setIsLoading(true);
    await updateUserAndHubspot(ReferralSource.OTHER);
  };

  // Group sources by category
  const categorizedSources = useMemo<
    Record<ReferralCategory, ReferralSourceItem[]>
  >(() => {
    const grouped: Record<string, ReferralSourceItem[]> = {
      [ReferralCategory.COMPANY_CHANNELS]: [],
      [ReferralCategory.NEWS_MEDIA]: [],
      [ReferralCategory.NONE]: [],
    };
    // Group sources
    REFERRAL_SOURCES.forEach(source => {
      if (source.category in grouped) {
        (grouped[source.category] || []).push(source);
      } else {
        (grouped[ReferralCategory.NONE] || []).push(source);
      }
    });

    return grouped as Record<ReferralCategory, ReferralSourceItem[]>;
  }, []);

  return (
    <Container sx={{ maxWidth: '500px !important' }}>
      <Typography variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
        Create Your Account
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: '28px', mb: 3, textAlign: 'center' }}
      >
        How Did You Hear About Us?
      </Typography>
      <Card elevation={2}>
        <CardContent>
          <RadioGroup
            value={referralSource}
            onChange={e => setReferralSource(e.target.value as ReferralSource)}
          >
            {/* Categorized sources with inline expansion */}
            <CategoryOption
              category={ReferralCategory.COMPANY_CHANNELS}
              isExpanded={
                expandedCategories[ReferralCategory.COMPANY_CHANNELS] || false
              }
              onToggle={() => toggleCategory(ReferralCategory.COMPANY_CHANNELS)}
              sources={
                categorizedSources[ReferralCategory.COMPANY_CHANNELS] || []
              }
              selectedValue={referralSource}
              onChange={value => setReferralSource(value as ReferralSource)}
            />

            <CategoryOption
              category={ReferralCategory.NEWS_MEDIA}
              isExpanded={
                expandedCategories[ReferralCategory.NEWS_MEDIA] || false
              }
              onToggle={() => toggleCategory(ReferralCategory.NEWS_MEDIA)}
              sources={categorizedSources[ReferralCategory.NEWS_MEDIA] || []}
              selectedValue={referralSource}
              onChange={value => setReferralSource(value as ReferralSource)}
            />

            {categorizedSources[ReferralCategory.NONE].map(source => (
              <FormControlLabel
                key={source.value}
                value={source.value}
                control={<Radio color="primary" />}
                label={source.name}
                sx={{ mb: 1, ml: 0 }}
              />
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="text"
          onClick={handleSkip}
          disabled={isLoading}
          sx={{ color: 'grey.500' }}
        >
          Skip
        </Button>
        <Button
          type="submit"
          variant="neutralRustTerracotta"
          disabled={!referralSource || isLoading}
          onClick={handleSubmit}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          Continue
        </Button>
      </Box>
    </Container>
  );
}

const Referral: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      }
    >
      <ReferralForm />
    </Suspense>
  );
};

export default Referral;
