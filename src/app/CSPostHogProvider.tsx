'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import React from 'react';

function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export const POSTHOG_EVENTS = {
  PROJECT_INVEST_CLICKED: '$project_invest_clicked',
  SCHEDULE_CALL_CLICKED: '$schedule_call_clicked',
  DEALFLOW_CONTINUE_CLICKED: '$dealflow_continue_clicked',
  DELETE_DEAL_CLICKED: '$delete_deal_clicked',
  PROJECT_PAGE_VIEWED: '$project_page_viewed',
  DOCUMENT_VIEWED: '$document_viewed',
  DOCUMENT_DOWNLOADED: '$document_downloaded',
  CHAT_OPENED: '$chat_opened',
};

export default CSPostHogProvider;
