export enum ReferralCategory {
  COMPANY_CHANNELS = 'company_channels',
  NEWS_MEDIA = 'news_media',
  NONE = '',
}

export interface ReferralSourceItem {
  name: string;
  value: string;
  category: ReferralCategory;
}

export enum ReferralSource {
  FRIEND_COLLEAGUE = 'friend_colleague',

  // Company Channels
  INVESTOR_EVENT = 'investor_event',
  WEBINAR = 'webinar',
  EVENT_MAILER = 'event_mailer',
  NEUTRAL_PODCAST = 'neutral_podcast',
  NEWSLETTER = 'newsletter',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  REDDIT = 'reddit',

  // News / Media
  NEWS_MEDIA = 'news-media',

  // Online Ads
  ONLINE_ADS = 'advertisement_online',

  // Advisor Firm
  ADVISOR_FIRM_EMPLOYEE = 'advisor_firm_employee',

  OTHER = 'other',
}

export const REFERRAL_SOURCES: ReferralSourceItem[] = [
  // Friend / Colleague
  {
    name: 'Friend / Colleague',
    value: ReferralSource.FRIEND_COLLEAGUE,
    category: ReferralCategory.NONE,
  },

  // Company Channels
  {
    name: 'Investor Event',
    value: ReferralSource.INVESTOR_EVENT,
    category: ReferralCategory.COMPANY_CHANNELS,
  },
  {
    name: 'Webinar',
    value: ReferralSource.WEBINAR,
    category: ReferralCategory.COMPANY_CHANNELS,
  },
  {
    name: 'Event Mailer',
    value: ReferralSource.EVENT_MAILER,
    category: ReferralCategory.COMPANY_CHANNELS,
  },
  {
    name: 'Neutral Podcast',
    value: ReferralSource.NEUTRAL_PODCAST,
    category: ReferralCategory.COMPANY_CHANNELS,
  },
  {
    name: 'Newsletter',
    value: ReferralSource.NEWSLETTER,
    category: ReferralCategory.COMPANY_CHANNELS,
  },
  {
    name: 'Instagram',
    value: ReferralSource.INSTAGRAM,
    category: ReferralCategory.COMPANY_CHANNELS,
  },
  {
    name: 'LinkedIn',
    value: ReferralSource.LINKEDIN,
    category: ReferralCategory.COMPANY_CHANNELS,
  },
  {
    name: 'Reddit',
    value: ReferralSource.REDDIT,
    category: ReferralCategory.COMPANY_CHANNELS,
  },

  // News / Media
  {
    name: 'News / Media',
    value: ReferralSource.NEWS_MEDIA,
    category: ReferralCategory.NEWS_MEDIA,
  },

  // Online Ads
  {
    name: 'Online Ads',
    value: ReferralSource.ONLINE_ADS,
    category: ReferralCategory.NONE,
  },

  // Other
  {
    name: 'Other',
    value: ReferralSource.OTHER,
    category: ReferralCategory.NONE,
  },
];
