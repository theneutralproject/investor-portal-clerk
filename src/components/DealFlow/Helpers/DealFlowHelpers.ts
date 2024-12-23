/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import { type DocusignEnvelopeCreateSchema } from '@/libs/docusign/schema';

import { type UserResource } from '@clerk/types';

// US states array
export const usStates = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

export default usStates;

export const createDocusignEnvelope = async (
  envelopeId: string,
  dealId: number,
  user: UserResource | null | undefined
) => {
  const url = `/api/docusign`;
  if (!user) {
    console.log('!user');
    return null;
  }
  const body: DocusignEnvelopeCreateSchema = {
    dealId: dealId,
    templateId: envelopeId,
  };

  const docusignResponse = await axios.post(url, body).catch(error => {
    if (error.response) {
      console.log('\n\n\nDOCUSIGN AXIOS NOT HAPPY:\n', error.response);
    } else {
      console.log('\n\n\nDOCUSIGN AXIOS NOT HAPPY:\n', error);
    }
    return error;
  });
  if (docusignResponse?.data?.consentUrl) {
    console.log('must authenticate using consentUrl');
    window.location.assign(docusignResponse.data.consentUrl);
  }

  if (docusignResponse?.data?.url) {
    window.location.assign(docusignResponse.data.url);
  }
};
