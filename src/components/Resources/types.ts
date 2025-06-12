import { ResourceItem } from '@/libs/types';

export type ContentField = 'content' | 'summary';

export interface IResourceCenterComponentProps {
  resources: ResourceItem[];
  contentField: ContentField;
}
