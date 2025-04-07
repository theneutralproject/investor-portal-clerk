import { PostHog } from 'posthog-js';
import { POSTHOG_EVENTS } from '../types';

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
