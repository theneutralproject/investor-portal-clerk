'use client';

import { Box, Typography } from '@mui/material';
import ProjectPageBanner from '@/components/Project/ProjectPageBanner';

const ConfidentialityAgreementPage = () => {
  return (
    <Box>
      <ProjectPageBanner
        background="/learnBanner.png"
        headline={`Confidentiality Agreement`}
        description="Confidentiality Agreement"
      />
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" paragraph>
          By logging into this web site (“Site”) you as a potential investor
          (“You”) are agreeing to the terms and conditions of usage which
          include non-disclosure obligations set out below. These obligations
          will apply to You for two (2) years after the last time you logged
          into the Site.
        </Typography>

        <Typography variant="body1" paragraph>
          You acknowledge that upon entering the Site, You have been given
          access to information (written or oral) relating to our business,
          operations, assets, properties, liabilities, or prospects, including
          information regarding practices, procedures, data, know-how,
          processes, business methods, customer lists, price lists, information
          regarding pricing, contracts, financial data, market studies, business
          or marketing plans, concepts, trade secret information, intellectual
          property, methods, patents, patent applications, inventions, ideas,
          improvements, historical financial data, financial projections and
          budgets, historical and projected sales, contractual arrangements,
          capital spending budgets and plans, the names and backgrounds of
          employees and consultants, employee and consultant organizational
          charts and employee and consultant data, customers, contractors,
          agents, vendors, suppliers and potential suppliers, all notes,
          analyses, compilations, studies, summaries and other material and all
          other information generally understood to be confidential, except for
          information which was generally available to the public prior to You
          accessing our Site (collectively, “Confidential Information”).
        </Typography>

        <Typography variant="body1" paragraph>
          You agree that You will keep all Confidential Information strictly
          confidential and shall not disclose any of such information, except
          that Confidential Information may be disclosed to Your advisers (such
          as attorneys, accountants or bankers) who need to know such
          information for the sole purpose of evaluating a potential investment
          with us and who are bound by professional duties of confidentiality
          with respect to the Confidential Information and are informed of the
          contents of this agreement and instructed by You to comply therewith.
          You agree that You shall use Confidential Information solely for the
          purpose of evaluating, negotiating and consummating a potential
          investment with us. You acknowledge our claim of ownership of
          Confidential Information and of intellectual property rights relating
          to such Confidential Information. We do not grant or imply to You any
          option, license, or conveyance of such rights.
        </Typography>

        <Typography variant="body1" paragraph>
          You further agree that if You are requested or required by applicable
          law, court order or proceeding or by any regulatory or self-regulatory
          authority, to disclose any of Confidential Information, You shall
          promptly notify us of any such request or requirement. You agree that
          You will cooperate with us to obtain an appropriate protective order
          or other reliable assurance that Confidential Information will be
          protected.
        </Typography>

        <Typography variant="body1" paragraph>
          We may at any time request You in writing for any reason whatsoever
          that You either return to us all Confidential Information (and all
          written or electronic copies thereof, as well as any materials or
          portions thereof prepared by You based on or derived from the
          Confidential Information), or destroy all such Confidential
          Information and certify to us to that effect.
        </Typography>
      </Box>
    </Box>
  );
};

export default ConfidentialityAgreementPage;
