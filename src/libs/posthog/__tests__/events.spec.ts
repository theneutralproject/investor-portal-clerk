import { PostHog } from 'posthog-js';
import { POSTHOG_EVENTS } from '@/libs/types';
import {
  captureDocumentEvent,
  captureDocumentDownloadEvent,
  captureDocumentViewEvent,
} from '../events';

const mockPosthog = {
  capture: jest.fn(),
} as unknown as PostHog;

const sampleDocument = {
  documentId: 42,
  documentName: 'Pitch Deck',
  projectId: 101,
  projectName: 'Solar Future',
  dateCreated: '2024-12-10T00:00:00Z',
};

describe('PostHog Events', () => {
  describe('captureDocumentEvent', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('calls posthog.capture with correct event and properties', () => {
      captureDocumentEvent(
        mockPosthog,
        sampleDocument,
        POSTHOG_EVENTS.DOCUMENT_VIEWED
      );

      expect(mockPosthog.capture).toHaveBeenCalledWith(
        POSTHOG_EVENTS.DOCUMENT_VIEWED,
        {
          document_date: sampleDocument.dateCreated,
          document_id: sampleDocument.documentId,
          document_name: sampleDocument.documentName,
          project_id: sampleDocument.projectId,
          project_name: sampleDocument.projectName,
        }
      );
    });
  });

  describe('captureDocumentDownloadEvent', () => {
    it('calls captureDocumentEvent with DOCUMENT_DOWNLOADED event', () => {
      captureDocumentDownloadEvent(mockPosthog, sampleDocument);

      expect(mockPosthog.capture).toHaveBeenCalledWith(
        POSTHOG_EVENTS.DOCUMENT_DOWNLOADED,
        expect.any(Object)
      );
    });
  });

  describe('captureDocumentViewEvent', () => {
    it('calls captureDocumentEvent with DOCUMENT_VIEWED event', () => {
      captureDocumentViewEvent(mockPosthog, sampleDocument);

      expect(mockPosthog.capture).toHaveBeenCalledWith(
        POSTHOG_EVENTS.DOCUMENT_VIEWED,
        expect.any(Object)
      );
    });
  });
});
