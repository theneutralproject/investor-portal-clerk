import {
  DealDocumentType,
  DocumentType,
  DealFinancingType,
} from '@prisma/client';

type ICreateDealOrOrganizationDocumentEntry = {
  type: 'deal' | 'organization';
  id: number;
  name: string;
  path: string;
  key: string;
  userId: number;
  dealDocumentType?: DealDocumentType;
  taxYear?: number;
};

type ICreateProjectDocumentEntry = {
  type: 'project';
  name: string;
  fileName: string;
  description?: string;
  link: string;
  projectId: number;
  dealStage: number;
  financingTypes: DealFinancingType[];
  documentType: DocumentType;
  docusignTemplateId?: string;
  dateCreated?: string; // ISO datetime format
  dateUpdated?: string; // ISO datetime format
  isPublic: boolean;
  requiresNDA: boolean;
};

export type ICreateGenericDocumentEntry =
  | ICreateDealOrOrganizationDocumentEntry
  | ICreateProjectDocumentEntry;
