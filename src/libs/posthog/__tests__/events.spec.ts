import { PostHog } from 'posthog-js';
import { POSTHOG_EVENTS } from '@/libs/types';
import {
  captureDocumentEvent,
  captureDocumentDownloadEvent,
  captureDocumentViewEvent,
  captureChatOpened,
  captureDealFlowContinueClick,
  captureDeleteDealClick,
  capturePageView,
  captureScheduleCallClick,
  identifyUser,
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

  describe('capturePageView', () => {
    it('sends a $pageview event with correct properties', () => {
      capturePageView(mockPosthog, {
        url: 'https://example.com/page',
        userId: '123',
        loggedIn: true,
      });

      expect(mockPosthog.capture).toHaveBeenCalledWith('$pageview', {
        current_url: 'https://example.com/page',
        user_id: '123',
        logged_in: true,
      });
    });
  });

  describe('identifyUser', () => {
    it('calls posthog.identify with correct ID and traits', () => {
      const mockIdentify = jest.fn();
      const posthogWithIdentify = {
        ...mockPosthog,
        identify: mockIdentify,
      } as unknown as PostHog;

      identifyUser(posthogWithIdentify, {
        email: 'user@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        id: 101,
      });

      expect(mockIdentify).toHaveBeenCalledWith('user@example.com', {
        email: 'user@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
        id: 101,
      });
    });
  });

  describe('captureChatOpened', () => {
    it('captures CHAT_OPENED event with type', () => {
      captureChatOpened(mockPosthog, 'support');

      expect(mockPosthog.capture).toHaveBeenCalledWith(
        POSTHOG_EVENTS.CHAT_OPENED,
        { type: 'support' }
      );
    });
  });

  describe('captureScheduleCallClick', () => {
    it('captures SCHEDULE_CALL_CLICKED event', () => {
      captureScheduleCallClick(mockPosthog);

      expect(mockPosthog.capture).toHaveBeenCalledWith(
        POSTHOG_EVENTS.SCHEDULE_CALL_CLICKED
      );
    });
  });

  describe('captureDealFlowContinueClick', () => {
    it('captures DEALFLOW_CONTINUE_CLICKED event with deal details', () => {
      const fakeDeal = {
        id: 123,
        dealStage: 2,
        project: {
          id: 456,
          name: 'Project Alpha',
        },
      };

      captureDealFlowContinueClick(mockPosthog, fakeDeal as any);

      expect(mockPosthog.capture).toHaveBeenCalledWith(
        POSTHOG_EVENTS.DEALFLOW_CONTINUE_CLICKED,
        {
          deal_id: 123,
          deal_stage: 2,
          project_id: 456,
          project_name: 'Project Alpha',
        }
      );
    });
  });

  describe('captureDeleteDealClick', () => {
    it('captures DELETE_DEAL_CLICKED event with deal ID', () => {
      captureDeleteDealClick(mockPosthog, 999);

      expect(mockPosthog.capture).toHaveBeenCalledWith(
        POSTHOG_EVENTS.DELETE_DEAL_CLICKED,
        { deal_id: 999 }
      );
    });
  });
});
