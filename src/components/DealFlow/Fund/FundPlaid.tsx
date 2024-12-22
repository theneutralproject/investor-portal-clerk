import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import PlaidLinkClass from '@/components/DealFlow/Fund/PlaidLink';
import { useDealFlow } from '@/components/DealFlow/Shared/DealFlowContext';
import DealFlowTitle from '@/components/DealFlow/Shared/DealFlowTitle';

interface FundPlaidProps {
  merchantId: string;
}

const PlaidLogo = () => (
  <svg
    width="57"
    height="22"
    viewBox="0 0 57 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_2765_15689)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.9687 7.45614C29.4905 7.04868 28.6744 6.84519 27.5199 6.84519H24.916V14.998H26.8631V12.4428H27.7353C28.7938 12.4428 29.5701 12.2068 30.0641 11.7342C30.6205 11.2049 30.9006 10.4999 30.9006 9.61994C30.9006 8.70739 30.5898 7.98598 29.9687 7.45614ZM27.6868 10.598H26.8631V8.68998H27.6032C28.5034 8.68998 28.9535 9.00989 28.9535 9.64973C28.9535 10.2813 28.531 10.598 27.6868 10.598ZM34.2323 6.84473H32.2021V14.9976H36.5856V13.1523H34.2323V6.84473ZM40.5634 6.84473L37.3741 14.9976H39.56L39.978 13.8123H42.7493L43.1316 14.9976H45.3419L42.1753 6.84473H40.5634ZM40.5394 12.1619L41.3759 9.37519L42.1992 12.1619H40.5394Z"
        fill="#111111"
      />
      <mask
        id="mask0_2765_15689"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="57"
        height="22"
      >
        <path d="M0 21.7585H57V0H0V21.7585Z" fill="white" />
      </mask>
      <g mask="url(#mask0_2765_15689)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M46.3568 14.9976H48.3876V6.84475H46.3568V14.9976ZM56.2717 8.37283C56.0152 7.99601 55.6858 7.67589 55.3036 7.43187C54.6906 7.04046 53.8541 6.84521 52.7951 6.84521H50.1197V14.9976H53.2493C54.3803 14.9976 55.2877 14.6231 55.9726 13.8733C56.6575 13.1239 56.9995 12.1293 56.9995 10.8905C56.9995 9.90504 56.7571 9.06583 56.2717 8.37283ZM53.0222 13.1519H52.1505V8.69046H53.0344C53.6555 8.69046 54.1328 8.88754 54.4676 9.28033C54.8023 9.67312 54.9697 10.2305 54.9697 10.9519C54.9697 12.4185 54.3205 13.1519 53.0222 13.1519ZM8.43102 0L1.85024 1.74625L0.0366429 8.45121L2.30488 10.8107L0 13.1312L1.70683 19.8655L8.25912 21.7204L10.5645 19.3994L12.8327 21.7585L19.4135 20.0122L21.2266 13.3068L18.9588 10.9482L21.2637 8.62767L19.5569 1.89292L13.0037 0.0380417L10.6993 2.35858L8.43102 0ZM4.39262 3.036L7.85921 2.11567L9.37514 3.69233L7.16436 5.918L4.39262 3.036ZM12.0026 3.71342L13.5429 2.16287L16.9946 3.14004L14.1776 5.97575L12.0026 3.71342ZM2.11352 7.90075L3.0685 4.36929L5.83933 7.25129L3.629 9.47696L2.11352 7.90029V7.90075ZM15.48 7.33104L18.297 4.49442L19.1954 8.04192L17.6555 9.59292L15.48 7.33104ZM8.46721 7.27283L10.678 5.04717L12.8526 7.3095L10.6423 9.53517L8.46721 7.27283ZM4.93231 10.8318L7.14264 8.60612L9.31859 10.8685L7.10736 13.0941L4.93231 10.8318ZM11.9456 10.89L14.1559 8.66433L16.3309 10.9267L14.1202 13.1523L11.9456 10.89ZM2.06738 13.7165L3.60819 12.1651L5.78279 14.4279L2.96671 17.2631L2.06738 13.7165ZM8.41021 14.449L10.621 12.2233L12.796 14.4856L10.5857 16.7113L8.41021 14.449ZM15.423 14.5076L17.6338 12.282L19.1497 13.8582L18.1952 17.3896L15.423 14.5076ZM4.26912 18.6189L7.08564 15.7822L9.26159 18.0446L7.72079 19.596L4.26912 18.6189ZM11.8886 18.0661L14.0989 15.8405L16.8702 18.7229L13.404 19.6428L11.8886 18.0661Z"
          fill="#111111"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_2765_15689">
        <rect width="57" height="22" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const FundPlaid: React.FC<FundPlaidProps> = ({ merchantId }) => {
  const { deal, refetchDeal, project } = useDealFlow();
  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="Fund Your Investment" />

      <Card
        sx={{
          mb: 3,
          backgroundColor: '#f5f5f5',
          borderColor: '#d8d8d8',
          borderRadius: '20px',
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="h6" flex={1}>
              Connect Your Bank Account
            </Typography>
            <PlaidLogo />
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, mb: 3 }}
          >
            Fund transfers are powered by our trusted partner, Plaid, the
            industry standard for connecting to bank accounts and transferring
            funds.
          </Typography>
          <PlaidLinkClass
            dealId={deal?.id}
            merchantId={merchantId}
            projectSlug={project?.slug}
            refetchDeal={refetchDeal}
          />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontSize: '12px' }}
          >
            By continuing, you authorize us to initiate an automated clearing
            house (ACH) one-time debit in your name to your bank account
            indicated above. The amount of this transaction as noted above will
            be presented to your financial institution by the next business day.
            You further agree that once you click submit you may not revoke this
            authorization or cancel this payment.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FundPlaid;
