/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';

import ProjectPageBanner from '@/components/Project/ProjectPageBanner';

const StyledContent = styled.div`
  font-size: 12pt;
  padding: 20px;
  margin: 0px;

  h1 {
    font-size: 20pt;
  }

  h2 {
    font-size: 16pt;
  }

  a {
    color: #0000ff;
    text-decoration: underline;
  }

  ul
    margin-left: 20px;
  }

  ul li,
  ol li, {
    margin-bottom: 8px;
  }

  ol li p {
    margin-left: -20px;
  }

  .underlined {
    text-decoration: underline;
  }

  .title-container {
    margin: 0 auto;
    text-align: center;
  }
`;

const PrivacyPolicyPage = () => {
  return (
    <Box>
      <ProjectPageBanner
        background="/learnBanner.png"
        headline={`Privacy Policy`}
        description="Privacy Policy"
      />
      <StyledContent>
        <div className="title-container">
          <h1>The Neutral Project, LLC</h1>
          <h2>Privacy Policy</h2>
        </div>
        <p>
          <span>Effective Date: </span>
          <strong>Jan 16, 2025</strong>
        </p>
        <p>
          <span>The Neutral Project, LLC (“</span>
          <strong>Neutral</strong>
          <span>” or “</span>
          <strong>we</strong>
          <span>,” “</span>
          <strong>us</strong>
          <span>,” or “</span>
          <strong>our</strong>
          <span>”) is committed to privacy. This Privacy Policy (“</span>
          <strong>Policy</strong>
          <span>
            ”) describes how we collect, use, protect and disclose Personal
            Information we collect or receive when you: (1) access the Neutral
            investor portal (the “
          </span>
          <strong>Investor Portal</strong>
          <span>
            ”) made available on or through websites owned or controlled by us
            (now or in the future), including at{' '}
          </span>
          <a href="https://www.neutral.us/">https://www.neutral.us/</a>
          <span>
             and webpages available from that website (collectively, the “
          </span>
          <strong>Site</strong>
          <span>
            ”); and (2) use any services provided by us through the Site (the “
          </span>
          <strong>Services</strong>
          <span>
            ,” and collectively with the Site and Investment Portal, the “
          </span>
          <strong>Platform</strong>
          <span>”).</span>
        </p>
        <p>
          <strong>
            PLEASE READ THIS POLICY CAREFULLY. THIS POLICY DOES NOT APPLY TO THE
            COLLECTION, USE, DISCLOSURE OR PROTECTION OF PERSONAL INFORMATION BY
            ANY THIRD PARTY, INCLUDING, WITHOUT LIMITATION, ANY THIRD PARTY WHO
            YOU ARE CONNECTED TO OR OTHERWISE INTERACT WITH THROUGH OR IN
            CONNECTION WITH YOUR ACCESS TO OR USE OF THE PLATFORM.
          </strong>
        </p>
        <p>
          <strong>
            WE MAY MODIFY THIS POLICY AT ANY TIME. ALL CHANGES WILL BE EFFECTIVE
            IMMEDIATELY UPON POSTING TO THE PLATFORM. MATERIAL CHANGES WILL BE
            CONSPICUOUSLY POSTED ON THE PLATFORM OR OTHERWISE COMMUNICATED TO
            YOU. IF YOU DO NOT WANT US TO COLLECT, USE OR SHARE YOUR INFORMATION
            IN THE WAYS DESCRIBED IN THIS POLICY, PLEASE DO NOT USE THE
            PLATFORM.
          </strong>
        </p>
        <p>
          <span>
            If you have any questions about this Policy, please contact us at 
          </span>
          <a href="mailto:invest@neutral.us">invest@neutral.us</a>
          <span>. </span>
        </p>
        <ol>
          <li>
            <h3>What is Personal Information?</h3>
            <p>
              <span>
                When we refer to “Personal Information” in this Policy, we mean
                information that identifies, relates to, describes or is
                reasonably capable of being associated with, or could reasonably
                be linked, directly or indirectly, to a specific person. Please
                note, Personal Information does not include information that is
                publicly available from government records or deidentified or
                aggregated consumer information. 
              </span>
            </p>
          </li>
          <li>
            <h3>The Information We Collect</h3>
            <p>
              <span>
                This section describes what Personal Information we collect and
                the different ways we collect it. We may collect the following
                Personal Information from or about you:
              </span>
            </p>

            <p>
              <i>Information We Collect from You</i>
            </p>
            <p>
              <span>
                In order to use or engage in some of our Services or use the
                Investor Portal, you will need to register for an account and
                provide certain Personal Information to us.
              </span>
            </p>
            <p>
              <span>
                This also applies if you are acting on behalf of an
                institution. If you do not provide the Personal Information we
                request, you may not be able to benefit from our Services if
                that information is necessary to provide you with the applicable
                Service or we are legally required to collect it.
              </span>
            </p>
            <ul>
              <li>
                <span className="underlined">Contact Information</span>
                <span>
                  : Your name, your address, phone number, email address, IP
                  address, and telephone number.
                </span>
              </li>
              <li>
                <span className="underlined">Regulated Information</span>
                <span>
                  : If we need to verify your Accredited Investor status, we
                  will collect your social security number or employer
                  identification number (as applicable), your signature,
                  physical characteristics, and description, bank statements,
                  W-2s, and other financial account information.
                </span>
              </li>
              <li>
                <span className="underlined">Biometric Information</span>
                <span>
                  : We collect your facial scan to verify your identity.
                </span>
              </li>
              <li>
                <span className="underlined">Protected Classifications</span>
                <span>
                  : This type of information may include your marital status.
                </span>
              </li>
              <li>
                <span className="underlined">
                  Sensitive Personal Information
                </span>
                <span>
                  : Some of the information we collect from you may be
                  considered sensitive personal information, including your
                  social security number, financial account information.
                </span>
              </li>
              <li>
                <span className="underlined">Communications</span>
                <span>
                  : We may also collect information about you when you
                  communicate with us, such as through our chat feature,
                  including answering your questions or when you provide
                  feedback, including relevant contact information and the
                  contents of your messages.
                </span>
              </li>
            </ul>
            <p>
              <i>Information Automatically Collected</i>
            </p>
            <p>
              <span>
                When you use the Platform, our systems automatically collect
                information that your browser or device sends whenever you visit
                a website or utilize an application. This information may
                include:
              </span>
            </p>
            <ul>
              <li>
                <span>Identifiers</span>
                <span>
                  : Such as your IP address, cookie identifiers, and your device
                  identifier.
                </span>
              </li>
              <li>
                <span>Internet Activity</span>
                <span>
                  : the type of device you are using, the internet service
                  provider or mobile carrier you are using, and your activities
                  within the Platform, including the links you click, the pages
                  or screens you view, your session time, the number of times
                  you click a page/screen or use a feature of the Investment
                  Portal, your browsing and search history, the date and time
                  you click on a page or use a feature and the amount of time
                  you spend on a page or using a feature.
                </span>
              </li>
              <li>
                <span>Geolocation</span>
                <span>
                  : We may be able to infer your general geographic location
                  based on your IP address (like your country and zip code).
                </span>
              </li>
            </ul>
            <p>
              <i>
                Information We Collect from Service Providers and Third Parties
              </i>
            </p>
            <ul>
              <li>
                <span>Service Providers</span>
                <span>
                  : We collect your Personal Information from service providers
                  when you register for the Services to validate your identity.
                  Service providers may also collect your Personal Information
                  on our behalf in their capacity as payment processors.
                </span>
              </li>
            </ul>
          </li>
          <li>
            <h3>How We Use the Information We Collect</h3>
            <p>
              <i>Customer Service and Customer Communications</i>
            </p>
            <p>
              <span>
                We may use the Personal Information we collect to provide you
                with the Services you requested, customer service, to provide
                you with alerts and updates about the Services, respond to your
                questions, and receive your feedback about the Platform. We
                provide a chat feature to request more information about our
                Services, which may be staffed by a human representative or
                hosted by a chatbot. We save transcripts of your interactions
                with our chat feature, which may contain Personal Information,
                in order to improve our Services and customer service.
              </span>
            </p>
            <p>
              <i>Account Registration and Management</i>
            </p>
            <p>
              <span>
                We use your Personal Information to register you with an account
                with us and to manage your account as necessary to provide you
                with the Services and maintain the security of your account.
              </span>
            </p>
            <p>
              <i>Site Analytics</i>
            </p>
            <p>
              <span>
                We may use Personal Information to better understand how you
                interact with our Platform, to monitor aggregate usage by our
                users and web traffic routing on our Site, and to improve our
                Platform.
              </span>
            </p>
            <p>
              <i>Marketing Purposes</i>
            </p>
            <p>
              <span>
                We may use the Personal Information we collect for our own
                marketing purposes including notifying you of investment
                opportunities and events via email and other means, subject to
                compliance with applicable laws. We may also link Personal
                Information (including your name, mobile phone number, and email
                address) with non-personal information (including Personal
                Information automatically collected as described in this Policy)
                and use such information for our own marketing purposes. If you
                do not want to use your Personal Information for marketing
                purposes, you may opt-out in accordance with the procedures
                described in the “Managing Your Personal Information” in Section
                8 below.
              </span>
            </p>
            <p>
              <i>Business Purposes</i>
            </p>
            <p>
              <span>
                We may use the Personal Information we collect for non-marketing
                business purposes including (1) validating your identity; (2)
                customizing your experience with the Platform;
              </span>
              <span>
                (3) carrying out our obligations and enforcing our rights
                arising from any contracts we have entered into, including, but
                not limited to, any contracts between you and us; (4) operating
                and improving the Platform; and (6) for other business purposes
                permitted under applicable law.
              </span>
            </p>
            <p>
              <i>Law Enforcement/Legal Purposes</i>
            </p>
            <p>
              <span>
                We may use Personal Data to cooperate with law enforcement or
                other legal purposes including: (1) complying with legal and
                regulatory requirements; (2) satisfying contractual obligations;
                (3) protecting and defending Neutral and its affiliates against
                legal actions or claims; (4) preventing fraud; (5) cooperating
                with law enforcement or other government agencies for purposes
                of investigations, national security, public safety or matters
                of public importance when we believe that disclosure of Personal
                Information is necessary or appropriate to protect the public
                interest; and (6) protecting and defending against legal actions
                or claims.
              </span>
            </p>
          </li>
          <li>
            <h3>How Long Do We Keep Your Personal Information?</h3>
            <p>
              <span>
                We retain Personal Information only as long as we have a
                legitimate business purpose to keep it. These purposes may
                include retaining Personal Information to: (1) complete the
                purpose for which the Personal Information was collected; (2)
                continue our ongoing business relationship with you; (3) ensure
                the security and integrity of the Platform and Services; and (4)
                satisfy any legal, regulatory, tax, accounting, or reporting
                requirements.
              </span>
            </p>
            <p>
              <span>
                To determine the appropriate retention period for individual
                categories of Personal Information we collect, we consider the
                nature and sensitivity of the Personal Information, the
                potential risk of harm from unauthorized use or disclosure of
                the Personal Information, the purposes for which we process that
                Personal Information and whether we can fulfill those purposes
                through other means and applicable legal, regulatory, tax,
                accounting, reporting or other requirements.
              </span>
            </p>
          </li>
          <li>
            <h3>With Whom We Share Personal Information </h3>
            <p>
              <span>
                For business purposes, we may share Personal Information we
                receive from and about you, and about your relationship with us,
                with our affiliates and certain third parties. This section
                describes the types of third parties we may share your Personal
                Information with and the purposes for that sharing. 
              </span>
            </p>
            <p>
              <i>Third Party Service Providers</i>
            </p>
            <p>
              <span>
                Your Personal Information may be shared with or collected by
                third party service providers who provide us with services,
                including, but not limited to data hosting, processing payments,
                providing accounting services and tax forms, and verifying your
                identity pursuant to applicable law. We require these
                third-party service providers to exercise reasonable care to
                protect your Personal Information and restrict their use of your
                Personal Information to the purposes for which it was provided
                to them.
              </span>
            </p>
            <p>
              <i>Third Party Businesses</i>
            </p>
            <p>
              <span>
                We may share certain limited Personal Information with other
                companies with whom we have a contractual relationship for their
                business and other lawful purposes.
              </span>
            </p>
            <p>
              <i>Analytics and Advertising Technology</i>
            </p>
            <p>
              <span>
                We may also allow third party businesses to use cookies or
                similar technologies to collect information about your browsing
                activities over time and across different websites following
                your use of the Site.
              </span>
            </p>
            <p>
              <i>Anonymous Information</i>
            </p>
            <p>
              <span>
                We may provide anonymized information to third parties. Any
                anonymized information we provide to third parties is not
                considered Personal Information and is not subject to the terms
                of this Policy.
              </span>
            </p>
            <p>
              <i>Parties to Business Transactions; Bankruptcy</i>
            </p>
            <p>
              <span>
                In the event of a merger, acquisition, bankruptcy or other sale
                of all or a portion of our assets, we may transfer or allow
                third parties to use information owned or controlled by us. We
                reserve the right, in connection with these types of
                transactions, to transfer or assign your information and other
                information we have collected from our customers to third
                parties or to authorize third parties to use any such
                information retained by us. Other than to the extent ordered by
                a bankruptcy or other court, the use and disclosure of all
                transferred user information will be subject to this
                Policy. However, any information you submit or that is collected
                after this type of transfer may be subject to a new privacy
                policy adopted by the successor entity.
              </span>
            </p>
            <p>
              <i>Government and Law Enforcement</i>
            </p>
            <p>
              <span>
                Neutral cooperates with government and law enforcement officials
                or private parties to enforce and comply with the law. To the
                extent permitted under applicable law, we may disclose any
                information about you to government or law enforcement officials
                or private parties as we believe is necessary or appropriate to
                investigate, respond to, and defend against legal claims, for
                legal process (including subpoenas), to protect the property and
                rights of Neutral or a third party, to protect Neutral against
                liability, for the safety of the public or any person, to
                prevent or stop any illegal, unethical, fraudulent, abusive, or
                legally actionable activity, to protect the security or
                integrity of the Platform and any equipment used to make the
                Platform available, or to comply with applicable law.
              </span>
            </p>
            <p>
              <i>Professional Advisors</i>
            </p>
            <p>
              <span>
                We may disclose your Personal Information to our professional
                advisors, such as our attorneys, accountants, financial
                advisors, and business advisors, in their capacity as advisors
                to us.
              </span>
            </p>
            <p>
              <i>Others</i>
            </p>
            <p>
              <span>
                We may disclose your Personal Information to any other third
                party upon your request or with your express consent to do so.
              </span>
            </p>
          </li>
          <li>
            <h3>Analytics Features</h3>
            <p>
              <span>
                We use cookies, pixels, session replay, and other web tracking
                technologies to collect information and analytics data when you
                visit the Platform (collectively, “Tracking Technologies”).
                Cookies are small text files that are stored on your device. You
                can learn more about cookies, including how to see what cookies
                have been downloaded to your device and to manage and delete
                them by visiting
              </span>
              <a href="https://www.allaboutcookies.org">
                https://www.allaboutcookies.org
              </a>
              <span>
                . We use Tracking Technologies to obtain analytical information
                about the operation and use of the Platform in order to help
                provide, operate, improve, and maintain the security of the
                Platform. The Tracking Technologies we use include:
              </span>
            </p>
            <ul>
              <li>
                <strong>Google Analytics:</strong>
                <span>
                   We may use Google Analytics, a web analytics service provided
                  by Google, Inc. ("
                </span>
                <strong>Google</strong>
                <span>
                  "), to assist us in understanding how the Platform is used.
                  Google Analytics will place cookies on your browser that will
                  generate information that we select about your use of our
                  Platform, including your computer's or mobile device's IP
                  address. That information will be transmitted directly to and
                  stored by Google. The information will be used for the
                  purposes of evaluating use of our Platform, compiling reports
                  on activity on our Platform for our use and providing other
                  services relating to activity on, and usage of, our Platform.
                  Google may also transfer this information to third parties
                  where required to do so by law, or where such third parties
                  process the information on Google's behalf. to prevent this
                  data from being used by Google Analytics, follow the
                  instructions to download and install the{' '}
                </span>
                <a href="https://tools.google.com/dlpage/gaoptout">
                  Google Analytics Opt-out Browser Add-on
                </a>
                <span> for each web browser you use. Using the </span>
                <a href="https://tools.google.com/dlpage/gaoptout">
                  Google Analytics opt-out browser add-on
                </a>
                <span>
                   will not prevent us from using other analytics tools and will
                  not prevent data from being sent to the Platform itself or to
                  Google. Opting out will not affect your use of the Platform.
                  For more information on how Google uses Personal Data,
                  visit{' '}
                </span>
                <a href="https://policies.google.com/privacy?hl=en">
                  Google’s Privacy Policy
                </a>
                <span> and Google’s page on </span>
                <a href="https://policies.google.com/technologies/partner-sites">
                  How Google uses data when you use our partners’ sites or apps
                </a>
                <span>.</span>
              </li>
            </ul>
            <ul>
              <li>
                <span>Google Tag Manager</span>
                <span> – We may use Google Tag Manager ("</span>
                <span>GTM</span>
                <span>
                  "), a tag management system that allows JavaScript and HTML
                  tags to be quickly deployed and updated on portions of our
                  Platform for tracking and analytics. We use GTM on our
                  Platform to include Google Analytics. If you have opted out of
                  Google Analytics, GTM takes this opt out into account. For
                  more information about Google's privacy practices applicable
                  to GTM, please refer to{' '}
                </span>
                <a href="https://policies.google.com/privacy?hl=en">
                  Google’s Privacy Policy
                </a>
                <span> and the terms of use at </span>
                <a href="https://marketingplatform.google.com/about/analytics/tag-manager/use-policy/">
                  Google Tag Manager’s Use Policy
                </a>
                <span>.</span>
              </li>
              <li>
                <span>Posthog </span>
                <span>
                  – We use session replay technology from Posthog. Session
                  replay technology allows us to collect information about how
                  you navigate and use the Platform in real-time. Session replay
                  technology collects information including the date and time
                  you visited the Platform, mouse clicks and movements,
                  keystrokes, scrolling, website or content load times, and site
                  errors. Posthog may collect Personal Information, such as IP
                  address, browser information, device IDs, and your operating
                  system. For more information on how Posthog uses your data,
                  please see their{' '}
                </span>
                <a href="https://posthog.com/privacy">Privacy Policy</a>
                <span>. </span>
              </li>
            </ul>
          </li>
          <li>
            <h3>Additional Information About Our Privacy Practices</h3>
            <p>
              <i>Deidentified and Aggregated Information</i>
            </p>
            <p>
              <span>
                We may also use information in the aggregate to understand how
                our users as a group use the Platform. Neutral will not collect
                additional categories of Personal Information or use the
                Personal Information we collect for materially different,
                unrelated or incompatible purposes without providing you notice.
              </span>
            </p>
            <p>
              <i>Protecting Your Personal Information</i>
            </p>
            <p>
              <span>
                We maintain commercially reasonable safeguards to maintain the
                security and privacy of Personal Information that you provide to
                us. Nevertheless, when disclosing Personal Information, you
                should remain mindful that there is an inherent risk in the use
                of email and the internet, and we cannot and do not guarantee
                that these measures will prevent every unauthorized attempt to
                access, use, or disclose your Personal Data despite our efforts.
              </span>
            </p>
            <p>
              <span>
                WE CANNOT GUARANTEE THE SECURITY OF ANY INFORMATION YOU DISCLOSE
                ONLINE, AND YOU DO SO AT YOUR OWN RISK.
              </span>
            </p>
            <p>
              <i>Children’s Privacy</i>
            </p>
            <p>
              <span>
                We do not knowingly collect or allow the collection of Personal
                Information via the Services from persons under the age of
                13. If we learn that we have collected the Personal Information
                of someone under the age of 13, we will take appropriate steps
                to delete this information. If you are a parent or guardian of
                someone under the age of 13 and discover that your child has
                submitted Personal Information, you may contact us at 
              </span>
              <a href="mailto:invest@neutral.us">invest@neutral.us</a>
              <span>
                 and ask us to remove your child’s Personal Information from our
                systems.
              </span>
            </p>
            <p>
              <i>Notice to Individuals Outside the United States</i>
            </p>
            <p>
              <span>
                Neutral’s Services are not intended for individuals located
                outside the United States. If you are not a resident of the
                United States, please do not provide us with any Personal
                Information.
              </span>
            </p>
            <p>
              <i>Third Party Websites</i>
            </p>
            <p>
              <span>
                For your convenience, the Platform may contain or provide links
                to other sites and resources provided by third parties. Except
                as otherwise described in this Policy, these links are provided
                for your convenience only and do not imply any affiliation with,
                or an endorsement, authorization, sponsorship or promotion of
                any third party. We are not responsible for the privacy policies
                or practices of any third-parties or any third-party websites.
                If you choose to access third-party websites, you do so at your
                own risk, and you should read the terms and conditions and
                privacy policies for each website that you visit.
              </span>
            </p>
            <p>
              <i>Social Media</i>
            </p>
            <p>
              <span>
                We are active on social media, including LinkedIn, Instagram,
                Facebook, and X. Anything you post on social media is public
                information and will not be treated confidentially. We may post
                (or re-post) on the Platform and our social media pages any
                comments or content that you post on our social media pages.
                Your use of social media is governed by the privacy policies and
                terms of the providers that own and operate those websites and
                not by this Policy. We encourage you to review those policies
                and terms.
              </span>
            </p>
          </li>
          <li>
            <h3>Managing Your Personal Information</h3>
            <p>
              <span>
                You may decline to share certain information with us, in which
                case, we may not be able to permit you to participate in some of
                the Services we offer. To protect your privacy and security and
                to comply with applicable law, we take reasonable steps to
                verify your identity before granting you account access or
                making corrections to your information. You are responsible for
                maintaining the secrecy of your unique password and account
                information at all times.
              </span>
            </p>
            <p>
              <i>Updating Your Contact Information</i>
            </p>
            <p>
              <span>
                You may update your contact information and communication
                preferences by contacting us as described below or logging into
                your online account.
              </span>
            </p>
            <p>
              <i>Email Opt-Out</i>
            </p>
            <p>
              <span>
                From time to time (and with your consent when required), you may
                receive periodic marketing emails from us with news or other
                information from us or on our behalf. If at any time you wish to
                stop receiving emails from us, please send us an email at 
              </span>
              <a href="mailto:invest@neutral.us">invest@neutral.us</a>
              <span>
                 or following the unsubscribe instructions set forth in any
                promotional messages from us.
              </span>
            </p>
            <p>
              <span>
                Your unsubscribe request or email preferences change will be
                processed promptly, though this process may take several
                days. During that processing period, you may receive additional
                promotional emails from us. Please note, opting out of email
                communications will not apply to email communications we send
                you about your account or other transactional email
                communications.
              </span>
            </p>
            <p>
              <i>Browser Settings</i>
            </p>
            <p>
              <span>
                Most browsers automatically accept cookies. You can disable this
                function by changing your browser settings but disabling cookies
                may impact your use and enjoyment of the Site. You cannot
                disable all cookies on the Site, such as cookies that are
                essential to the functioning of the Site. You can manually
                delete persistent cookies, or cookies that track your activity
                across websites, through your browser settings.
              </span>
            </p>
            <p>
              <i>Consumer Resources</i>
            </p>
            <p>
              <span>
                To change your preferences with respect to certain online ads
                and to obtain more information about third-party ad networks and
                online behavioral advertising, visit{' '}
              </span>
              <a href="https://optout.networkadvertising.org/?c=1">
                National Advertising Initiative Consumer opt-out page
              </a>
              <span> or the </span>
              <a href="http://www.aboutads.info/">
                Digital Advertising Alliance Self-Regulatory Program
              </a>
              <span>
                . Changing your settings with individual browsers or ad networks
                will not necessarily carry over to other browsers or ad
                networks. As a result, depending on the opt-outs you request,
                you may still see our ads.
              </span>
            </p>
            <p>
              <i>Do Not Track</i>
            </p>
            <p>
              <span>
                Please note that we have not yet developed a response to browser
                “Do Not Track” signals, and do not change any of our data
                collection practices when we receive such signals. We will
                continue to evaluate potential responses to “Do Not Track”
                signals in light of industry developments or legal changes.
              </span>
            </p>
            <p>
              <i>Rights Under California’s Shine the Light Law</i>
            </p>
            <p>
              <span>
                California residents have the right, once per calendar year, to
                request information from us regarding the manner in which we
                share certain categories of Personal Information with third
                parties for their direct marketing purposes, in addition to the
                rights set forth above. Under California’s Shine the Light Law,
                you have the right to send us a request at the designated email
                address listed below to receive the following information:
              </span>
            </p>
            <ul>
              <li>
                <span>
                  the categories of Personal Information we disclosed to third
                  parties for their direct marketing purposes during the
                  preceding calendar year;
                </span>
              </li>
              <li>
                <span>
                  the names and addresses of the third parties that received the
                  information; and
                </span>
              </li>
              <li>
                <span>
                  if the nature of the third party’s business cannot be
                  determined from their name, examples of the products or
                  services marketed.
                </span>
              </li>
            </ul>
            <p>
              <span>
                This information may be provided in a standardized form that is
                not specific to you. The designated email address for these
                requests is 
              </span>
              <a href="mailto:invest@neutral.us">invest@neutral.us</a>
              <span>.</span>
            </p>
          </li>
          <li>
            <h3>Contact Us</h3>
            <p>
              <span>
                If you have questions regarding our Privacy Policy or the use of
                Personal Information collected or used by Neutral, please
                contact us using the following information:
              </span>
            </p>
            <p>25 W Main Street Unit 500</p>
            <p>Madison, WI 53703</p>
            <p>
              <a href="mailto:invest@neutral.us">invest@neutral.us</a>
            </p>
          </li>
        </ol>
      </StyledContent>
    </Box>
  );
};

export default PrivacyPolicyPage;
