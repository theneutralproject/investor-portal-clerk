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

const docusignErrorMessage =
  'We are unable to process the Docusign document. Please refresh your browser window and try again. Contact a member of the team if the problem persists.';

export const createDocusignEnvelope = async (
  envelopeId: string,
  dealId: number,
  user: UserResource | null | undefined
) => {
  const url = `/api/docusign`;
  if (!user) {
    return {
      message: docusignErrorMessage,
      code: 499,
    };
  }
  const body: DocusignEnvelopeCreateSchema = {
    dealId: dealId,
    templateId: envelopeId,
  };

  const docusignResponse = await axios.post(url, body).catch(error => {
    if (error.response) {
      // TODO: handle error and alert user
      console.log('\n\n\nDOCUSIGN AXIOS NOT HAPPY:\n', error.response);
    } else {
      console.log('\n\n\nDOCUSIGN AXIOS NOT HAPPY:\n', error);
    }
    if (!user) {
      return {
        message: docusignErrorMessage,
        code: 599,
      };
    }
  });
  let returnUrl = '';
  if (docusignResponse?.data?.consentUrl) {
    console.log('must authenticate using consentUrl');
    returnUrl = docusignResponse.data.consentUrl;
  }

  if (docusignResponse?.data?.url) {
    returnUrl = docusignResponse.data.url;
  }

  return {
    message: 'Redirecting to Docusign...',
    url: returnUrl,
    code: 200,
  };
};
