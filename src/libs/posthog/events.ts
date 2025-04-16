import { PostHog } from 'posthog-js';
import { DealWithOrgMembersAndProject, POSTHOG_EVENTS } from '../types';

export interface IPostHogDocumentWithProject {
  documentId: number;
  documentName: string;
  projectName: string;
  projectId?: number;
  dateCreated?: string;
}

type PosthogEvent = (typeof POSTHOG_EVENTS)[keyof typeof POSTHOG_EVENTS];

export const captureDocumentEvent = (
  posthog: PostHog,
  documentWithProject: IPostHogDocumentWithProject,
  event: PosthogEvent
) => {
  posthog.capture(event, {
    document_date: documentWithProject.dateCreated,
    document_id: documentWithProject.documentId,
    document_name: documentWithProject.documentName,
    project_id: documentWithProject.projectId,
    project_name: documentWithProject.projectName,
  });
};

export const captureDocumentDownloadEvent = (
  posthog: PostHog,
  documentWithProject: IPostHogDocumentWithProject
) => {
  captureDocumentEvent(
    posthog,
    documentWithProject,
    POSTHOG_EVENTS.DOCUMENT_DOWNLOADED
  );
};

export const captureDocumentViewEvent = (
  posthog: PostHog,
  documentWithProject: IPostHogDocumentWithProject
) => {
  captureDocumentEvent(
    posthog,
    documentWithProject,
    POSTHOG_EVENTS.DOCUMENT_VIEWED
  );
};

export const capturePageView = (
  posthog: PostHog,
  data: { url: string; userId?: number | string; loggedIn?: boolean }
) => {
  posthog.capture('$pageview', {
    current_url: data.url,
    user_id: data.userId,
    logged_in: data.loggedIn,
  });
};

export const identifyUser = (
  posthog: PostHog,
  data: {
    email?: string;
    firstName: string | null;
    lastName: string | null;
    id: string | number;
  }
) => {
  posthog.identify(data.email?.toString(), {
    email: data.email?.toString(),
    firstname: data.firstName,
    lastname: data.lastName,
    id: data.id,
  });
};

export const captureChatOpened = (posthog: PostHog, type: string) => {
  posthog.capture(POSTHOG_EVENTS.CHAT_OPENED, {
    type,
  });
};

export const captureScheduleCallClick = (posthog: PostHog) => {
  posthog.capture(POSTHOG_EVENTS.SCHEDULE_CALL_CLICKED);
};

export const captureDealFlowContinueClick = (
  posthog: PostHog,
  deal: DealWithOrgMembersAndProject
) => {
  posthog.capture(POSTHOG_EVENTS.DEALFLOW_CONTINUE_CLICKED, {
    deal_id: deal.id,
    deal_stage: deal.dealStage,
    project_id: deal.project.id,
    project_name: deal.project.name,
  });
};

export const captureDeleteDealClick = (posthog: PostHog, dealId: number) => {
  posthog.capture(POSTHOG_EVENTS.DELETE_DEAL_CLICKED, {
    deal_id: dealId,
  });
};
