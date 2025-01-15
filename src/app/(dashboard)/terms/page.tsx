/* eslint-disable react/no-unescaped-entities */
'use client';

import { Box, Grid } from '@mui/material';
import styled from 'styled-components';

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

  ol {
    padding-left: 20px;
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

const TermsPage = () => {
  return (
    <Box>
      <ProjectPageBanner
        background="/learnBanner.png"
        headline={`Terms & Conditions`}
        description="Terms & Conditions"
      />
      <StyledContent>
        <div className="title-container">
          <h1>The Neutral Project, LLC</h1>
          <h2>Terms of Service</h2>
        </div>
        <p>
          <span>Effective Date: </span>
          <strong>Jan 16, 2025</strong>
        </p>
        <p>
          <span>Welcome to the website of The Neutral Project, LLC (“</span>
          <strong>Neutral</strong>
          <span>,” “</span>
          <strong>we</strong>
          <span>,” “</span>
          <strong>us</strong>
          <span>” or “</span>
          <strong>our</strong>
          <span>”). These Terms of Service (the “</span>
          <strong>Terms</strong>
          <span>
            ”) governs your access and use of Neutral’s investor portal (the “
          </span>
          <strong>Investment Portal</strong>
          <span>
            ”) made available through websites owned or controlled by Neutral
            (now or in the future), including at{' '}
          </span>
          <span>
            <a href="https://www.neutral.us/">https://www.neutral.us/</a>
          </span>
          <span>
            {' '}
            and webpages available from that site (collectively, the “
          </span>
          <strong>Site</strong>
          <span>
            ”) or any services provided by Neutral through the Site (the “
          </span>
          <strong>Services</strong>
          <span>
            ,” and collectively with the Site and Investment Portal, the “
          </span>
          <strong>Platform</strong>
          <span>”). </span>
        </p>
        <p>
          <strong>YOUR USE OF THE PLATFORM IS GOVERNED BY THESE TERMS. </strong>
        </p>
        <p>
          <span>
            PLEASE READ THESE TERMS CAREFULLY. BY ACCESSING OR USING THE
            PLATFORM OR REGISTERING TO USE THE INVESTOR PORTAL,{' '}
          </span>
          <span>
            YOU AGREE TO BE LEGALLY BOUND BY THESE TERMS AND ANY ADDITIONAL
            RULES AND REGULATIONS GOVERNING ACCESS TO OR USE OF THE PLATFORM. IF
            YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT USE THE PLATFORM. IF
            YOU ARE AN INVESTOR WHO IS SUBJECT TO A FULLY EXECUTED SUBSCRIPTION
            AGREEMENT WITH NEUTRAL, THE TERMS OF SUCH SUBSCRIPTION AGREEMENT
            CONTROL THE TERMS OF YOUR INVESTMENT AND GOVERN IN THE EVENT OF A
            CONFLICT WITH THESE TERMS.
          </span>
        </p>
        <p>
          <strong>
            COOKIES, PIXELS, SESSION REPLAY AND OTHER TRACKING TECHNOLOGIES.
          </strong>
        </p>
        <p>
          <span>
            WE MAY USE COOKIES, PIXELS, SESSION REPLAY AND OTHER TRACKING
            TECHNOLOGIES, INCLUDING THIRD-PARTY TRACKING TECHNOLOGIES
            (COLLECTIVELY “
          </span>
          <strong>TRACKING TECHNOLOGIES</strong>
          <span>
            ”) ON OUR PLATFORM. WE USE TRACKING TECHNOLOGIES TO COLLECT AND
            PERFORM DATA ANALYTICS, AND TO RECORD HOW YOU INTERACT WITH THE
            PLATFORM AND OUR CONTENT. BY VISITING AND USING OUR PLATFORM, YOU
            ARE CONSENTING TO OUR USE OF TRACKING TECHNOLOGIES AND UNDERSTAND
            AND AGREE THAT WE MAY SHARE PERSONAL INFORMATION ABOUT YOU WHICH WE
            COLLECT FROM THE USE OF TRACKING TECHNOLOGIES WITH OUR THIRD-PARTY
            ANALYTICS PARTNERS. FOR MORE INFORMATION ABOUT HOW WE USE TRACKING
            TECHNOLOGIES, PLEASE SEE OUR <a href="/privacy">PRIVACY POLICY</a>.
          </span>
        </p>
        <ol>
          <li>
            <h3>Eligibility</h3>
            <p>
              <span>
                By accessing, using or registering to use the Platform you
                represent and warrant that you are at least 18 years old and are
                lawfully able to enter into and agree to these Terms. If you are
                accessing or using the Platform or creating an account in the
                Investor Portal on behalf of an entity, you represent and
                warrant that you are authorized to enter into these Terms on
                behalf of any entity if you are accessing, using or registering
                to use the Platform on behalf of that entity.{' '}
              </span>
            </p>
          </li>
          <li>
            <h3>Changes to these Terms</h3>
            <p>
              <span>
                These Terms may be modified by us from time to time without
                notice to you. We will post the revised Terms on the Platform
                and notify you of any material changes. Your continued use of
                the Platform after we publish any change to these Terms, whether
                or not we send out a notice about the change, means that you
                have agreed to the updated Terms.
              </span>
            </p>
          </li>
          <li>
            <h3>Limited License</h3>
            <p>
              <span>
                Subject to your acceptance of and compliance with these Terms,
                we hereby grant you a limited, revocable, non-transferable,
                non-sublicensable, and non-exclusive license right to access and
                use the Platform, to download and print copies of any portion of
                the Content to which you have properly gained access, only for
                your own personal, non-commercial use, and only if you do not
                remove, modify, or obscure any copyright, trademark, or other
                proprietary notices from the Content you download or print.{' '}
              </span>
            </p>
          </li>
          <li>
            <h3>Ownership</h3>
            <ol>
              <li>
                <span>
                  All right, title, and interest in and to the Platform,
                  including, but not limited to, all of the software and code
                  that comprises and operates the Platform and all of the text,
                  photographs, images, illustrations, graphics, audio, video,
                  audio-video clips, advertising copy, and other materials
                  provided through the Platform (collectively, the “
                </span>
                <span>Content</span>
                <span>
                  ”) are owned by Neutral or by third parties who have licensed
                  their content to us. The Platform is protected under
                  trademark, service mark, trade dress, copyright, patent, trade
                  secret, and other intellectual property laws. In addition, the
                  entire Content of the Platform is a collective work under
                  United States and international copyright laws and treaties,
                  and Neutral owns the copyright in the selection, coordination,
                  arrangement, and enhancement of the Content of the Platform.
                </span>
              </li>
              <li>
                <span>
                  We reserve all rights not expressly granted to you in these
                  Terms. Except for the limited rights and licenses expressly
                  granted under these Terms, nothing in these Terms grants, by
                  implication, waiver, estoppel or otherwise, to you or any
                  third party any intellectual property rights or other right,
                  title or interest in or to the Platform the Content, or any
                  and all intellectual property provided to you or any other
                  user in connection with the foregoing.
                </span>
              </li>
              <li>
                <span>
                  Neutral names and logos (including, but not limited to, those
                  of its affiliates), all product and service names, all
                  graphics, all button icons, and all trademarks, service marks,
                  and logos appearing within the Platform, unless otherwise
                  noted, are trademarks (whether registered or not), service
                  marks, and/or trade dress of Neutral and/or those of its
                  affiliates (collectively, the “
                </span>
                <strong>Neutral Marks</strong>
                <span>
                  ”). All other trademarks, product names, company names, logos,
                  service marks, and/or trade dress (collectively, “
                </span>
                <strong>Other Marks</strong>
                <span>
                  ”) mentioned, displayed, cited, or otherwise indicated within
                  the Platform are the property of their respective owners. You
                  are not authorized to display or use the Neutral Marks in any
                  manner without our prior written permission. You are not
                  authorized to display or use the Other Marks without the prior
                  written permission of the applicable third party.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <h3>Your Account</h3>
            <ol>
              <li>
                <span>
                  In order to access certain parts of the Investor Portal, you
                  must register for an account. You are responsible for
                  reviewing all information about you or your investment
                  entities in your account the first time that you login to the
                  Investor Portal and for immediately updating that information
                  if it is outdated or otherwise incorrect. You must provide
                  true, accurate, current, and complete information about you
                  and/or your investment entities as may be prompted by any
                  registration forms. If any information that you provide to us
                  changes, you must promptly update the relevant registration
                  information. All Personal Information collected in the
                  Investor Portal will be handled pursuant to our current
                  <a href="/privacy">Privacy Policy</a>.
                </span>
              </li>
              <li>
                <span>
                  You are responsible for maintaining the confidentiality of
                  your account username and password. We have the right to
                  assume that anyone accessing the Investor Portal using a valid
                  password associated with your account has the right to do so.
                  You will be solely responsible for the activities of anyone
                  who accesses the Investor Portal using a valid password
                  associated with your account, even if the individual is not in
                  fact authorized by you. You agree to take reasonable steps to
                  prevent others from obtaining your account access information
                  and to immediately change your username and password should
                  you learn that these credentials have been lost or stolen and
                  to promptly notify us of any unauthorized access to your
                  account or any need to update or remove access for any of your
                  employees or agents.{' '}
                </span>
              </li>
              <li>
                <span>
                  We use our service provider, Finix to help facilitate payments
                  made via Automated Clearing House (ACH). For more information
                  about Finix and its practices, please see Finix’s{' '}
                </span>
                <span>
                  <a href="https://finix.com/terms-and-policies/privacy-policy">
                    Privacy Policy
                  </a>
                </span>
                <span>
                  . You do not have to use this service in order to use the
                  Investment Portal or to invest with us.
                </span>
              </li>
              <li>
                <span>
                  You acknowledge, understand, and agree that you do not have an
                  expectation of privacy in activities related to the Investor
                  Portal except as described in the{' '}
                  <a href="/privacy">Privacy Policy</a>.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <h3>Account Termination</h3>
            <ol>
              <li>
                <strong>Cancellation by You.</strong>
                <span>
                  {' '}
                  Subject to restrictions and other obligations set forth in
                  these Terms, you may, as applicable, withdraw your
                  registration, unsubscribe and/or close your account at any
                  time by providing written notice to us using any contact
                  method in the Contact Us section of these Terms and following
                  the instructions we provide. If you withdraw your
                  registration, unsubscribe and/or close your account, these
                  Terms will be terminated, your rights to access or use the
                  Investor Portal shall immediately terminate. Any user content
                  you have submitted using the Site may remain in our archives
                  and continue to be accessible by other users. We have no
                  obligation to return any user content you have submitted.{' '}
                </span>
              </li>
              <li>
                <strong>Suspension or Termination by Neutral.</strong>
                <span>
                  {' '}
                  In addition to, and not in lieu of, any of our other rights
                  set forth in these Terms, we reserve the right, with or
                  without notice and in our sole discretion, to, as applicable,
                  terminate or suspend these Terms, your registration,
                  subscription, and/or account and/or your access to or use of
                  the Investor Portal for any reason, including, without
                  limitation, for lack of use or if we believe that you have
                  violated or acted inconsistently with the letter or spirit of
                  these Terms, or in the case of any activity by you that may
                  harm us or other users, including, but not limited to, fraud,
                  abuse of privileges or misuse of the Investor Portal. You
                  agree that we will not be liable to you or any third party for
                  any such termination or suspension. If we exercise our
                  termination rights available under these Terms, your rights to
                  access and use the Investor Portal shall immediately terminate
                  and you must discontinue your access to and use of the
                  Investor Portal.
                </span>
              </li>
              <li>
                <strong>Fraudulent Activity.</strong>
                <span>
                  {' '}
                  If we suspect that you are engaging in any fraudulent, abusive
                  or illegal activity, we may refer such matter to appropriate
                  law enforcement authorities.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <h3>Acceptable Use of the Platform; Internet Access Required</h3>
            <p>
              <span>
                You may only use the Platform for lawful purposes, in accordance
                with these Terms, and only for intended purposes, as determined
                in Neutral's sole discretion, as documented in the following (“
              </span>
              <strong>Acceptable Use Restrictions</strong>
              <span>”).</span>
            </p>
            <p>
              <span>
                You must notify us immediately should you become aware of anyone
                violating the Acceptable Use Restrictions and shall reasonably
                assist us with any investigations that we may conduct in light
                of the information you provide.
              </span>
            </p>
            <ol>
              <li>
                <span>
                  You are specifically prohibited from using the Platform to
                  defame, abuse, harass, bully, threaten or otherwise violate
                  the legal rights (such as the rights of privacy and publicity)
                  of others, and/or publish, post, distribute or disseminate any
                  defamatory, infringing, obscene, pornographic, sexual,
                  indecent or unlawful material or information, including hate
                  speech, to an individual or group of individuals based on the
                  basis of religious belief, race, gender, age, disability, or
                  otherwise, or engage in criminal behavior, or cause others to
                  engage in any of the aforementioned conduct.
                </span>
              </li>
              <li>
                <span>
                  You shall not use the Platform to engage in any of the
                  following activities:
                </span>
                <ol>
                  <li>
                    <span>
                      accessing, using, or uploading content to, or attempt to
                      access, use, or upload content to another user’s account
                      without permission;
                    </span>
                  </li>
                  <li>
                    <span>
                      violating any federal, state, local, or other laws;
                    </span>
                  </li>
                  <li>
                    <span>
                      transmitting or uploading to the Platform any software or
                      other materials that contain any viruses, worms, trojan
                      horses, defects, time bombs, or other items of a
                      destructive nature;
                    </span>
                  </li>
                  <li>
                    <span>
                      engaging in commercial activity, including, without
                      limitation, commercial use of the Platform, including but
                      not limited to, sending spam, except for the purposes of
                      engaging in the activities for which the Platform was
                      designed;
                    </span>
                  </li>
                  <li>
                    <span>
                      creating user accounts by automated means or under false,
                      misleading, or fraudulent pretenses.
                    </span>
                  </li>
                  <li>
                    <span>
                      inciting violence, or posting images containing nudity or
                      graphic or gratuitous violence or{' '}
                    </span>
                  </li>
                  <li>
                    <span>
                      identifying any person without their consent or disclosing
                      anyone else’s personal contact details or invading their
                      privacy
                    </span>
                  </li>
                </ol>
              </li>
              <li>
                <span>
                  You shall not engage in, or attempt to engage in, any of the
                  following:
                </span>
                <ol>
                  <li>
                    <span>
                      reformatting or framing any portion of the Platform;
                    </span>
                  </li>
                  <li>
                    <span>
                      using any device, software, or procedure that interferes
                      with, or attempts to interfere with, the normal operation
                      of the Platform;
                    </span>
                  </li>
                  <li>
                    <span>
                      taking any action that imposes, or may impose in Neutral’s
                      sole discretion, an unreasonable or disproportionately
                      large load on our information technology infrastructure;
                    </span>
                  </li>
                  <li>
                    <span>
                      modifying, adapting, translating, or reverse engineering
                      any portion of the Platform;
                    </span>
                  </li>
                  <li>
                    <span>
                      disrupting or otherwise interfering with the Platform or
                      the networks or servers used by Neutral;
                    </span>
                  </li>
                  <li>
                    <span>
                      impersonating any person or entity or misrepresenting your
                      connection or affiliation with a person or entity;
                    </span>
                  </li>
                  <li>
                    <span>creating an account for another person;</span>
                  </li>
                  <li>
                    <span>
                      selling, assigning, transferring, sublicensing, pledging,
                      renting or otherwise sharing your rights under these
                      Terms;{' '}
                    </span>
                  </li>
                  <li>
                    <span>
                      creating any derivative works based on the Platform;{' '}
                    </span>
                  </li>
                  <li>
                    <span>
                      modifying, obscuring or removing any proprietary notices
                      on the Platform or copies thereof;{' '}
                    </span>
                  </li>
                  <li>
                    <span>
                      harassing, annoying, intimidating or threatening any of
                      our employees or agents engaged in providing any portion
                      of the Services to you;
                    </span>
                  </li>
                  <li>
                    <span>
                      collecting or storing, or attempting to collect or store,
                      personal information about other users of the Platform; or
                    </span>
                  </li>
                  <li>
                    <span>
                      any activity that is illegal under federal, state, local,
                      or other laws.
                    </span>
                  </li>
                </ol>
              </li>
              <li>
                <span>
                  Those portions of the Platform that relate to current
                  investment opportunities or to making investments offered
                  therein are available only to certain qualified, registered
                  and authorized users. Therefore, such portions may not be
                  available in all jurisdictions.
                </span>
              </li>
              <li>
                <span>
                  Access to the Platform requires access to the internet. You
                  are responsible for providing and maintaining all equipment
                  necessary to establish a connection to the internet, access to
                  the internet, and any telephone, wireless or other connection
                  and service fees associated with such access. Using the
                  Platform may allow you to receive Content on your mobile phone
                  or other wireless device. The manner in which that Content is
                  delivered to your phone or device may cause you to incur extra
                  data, text messaging or other charges from your wireless
                  carrier, which are your sole responsibility.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <h3>Securities Offerings; No Professional Advice Provided</h3>
            <ol>
              <li>
                <strong>
                  Neither the Content, Investment Portal, nor any communication
                  by Neutral through the Platform should be construed or is
                  intended to be a recommendation to purchase, sell, or hold any
                  security.
                </strong>
                <span>
                  {' '}
                  Investment overviews on the Platform contain summaries of the
                  purpose and principal business terms of the investment
                  opportunities. Such summaries are intended for informational
                  purposes only and do not purport to be complete, and each is
                  qualified in its entirety by reference to the more detailed
                  discussions contained in the investor document package
                  relating to such investment opportunity. The information
                  contained in the Platform has been prepared by Neutral without
                  reference to any particular investment requirements or
                  financial situation, and potential investors should consult
                  with their own professional tax, legal and financial advisors
                  before making any investment.
                </span>
              </li>
              <li>
                <strong>
                  THE SECURITIES DESCRIBED IN THE INVESTMENT PORTAL SHOULD BE
                  CONSIDERED FOR INVESTMENT ONLY BY PERSONS WHO CAN AFFORD TO
                  SUSTAIN A LOSS OF THEIR ENTIRE INVESTMENT. PROSPECTIVE
                  INVESTORS WILL BE REQUIRED TO REPRESENT THAT THEY ARE FAMILIAR
                  WITH AND UNDERSTAND THE TERMS OF THE PROPOSED INVESTMENT, AND
                  THAT THEY HAVE SUCH KNOWLEDGE AND EXPERIENCE IN FINANCIAL AND
                  BUSINESS MATTERS THAT THEY ARE CAPABLE OF EVALUATING THE
                  MERITS AND RISKS OF THIS INVESTMENT. PROSPECTIVE INVESTORS ARE
                  NOT TO CONSTRUE THE CONTENTS OF THE PLATFORM OR ANY PRIOR OR
                  SUBSEQUENT COMMUNICATION FROM NEUTRAL OR ANY OF ITS AFFILIATES
                  OR ANY REPRESENTATIVE OF NEUTRAL AS LEGAL, BUSINESS OR TAX
                  ADVICE. EACH PROSPECTIVE INVESTOR SHOULD CONSULT ITS, HIS OR
                  HER OWN INDEPENDENT PERSONAL COUNSEL, ACCOUNTANT, AND OTHER
                  ADVISORS AS TO LEGAL, TAX, ECONOMIC, FINANCIAL AND RELATED
                  MATTERS CONCERNING THE INVESTMENT DESCRIBED HEREIN AND ITS
                  SUITABILITY FOR SUCH PROSPECTIVE INVESTOR.
                </strong>
              </li>
              <li>
                <span>
                  The securities described on the Platform have not been
                  registered under the Securities Act of 1933, as amended (the “
                </span>
                <strong>Securities Act</strong>
                <span>
                  ”), in reliance on the exemptive provisions of Section 4(2) of
                  the Securities Act, Rule 506(c) of Regulation D, and/or
                  Regulation S, promulgated thereunder. Securities sold through
                  private placements are restricted and not publicly tradeable
                  and are therefore illiquid. Neither the U.S. Securities and
                  Exchange Commission nor any state securities commission or
                  other regulatory authority has approved, passed upon or
                  endorsed the merits of any offering on the Investor Portal.
                </span>
              </li>
              <li>
                <span>
                  For persons residing in the United States, only “accredited
                  investors,” as defined in Rule 501 of Regulation D of the
                  Securities Act, with a valid username and password, are
                  authorized to access certain services and web pages (such
                  persons being referred to as “
                </span>
                <strong>Accredited Investors</strong>
                <span>
                  ”). Prior to making any investment through the Investor
                  Portal, you will be required to provide supporting documents
                  proving that you are an Accredited Investor. Alternatively,
                  you may use one of our third-party verification providers.
                  Your failure to provide any information and documentation
                  requested to confirm your status as an Accredited Investor
                  will be cause for us to discontinue your access to the
                  Investor Portal
                </span>
              </li>
              <li>
                <span>
                  Neutral is not a registered broker-dealer, funding portal,
                  investment company, or investment advisor and does not conduct
                  any activity that would require registration as such.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <h3>Privacy Policy</h3>
            <p>
              <span>
                We may collect certain Personal Information from you when you
                access or use the Platform, including through the use of
                technology. For information about how we collect, use, share and
                secure your Personal Information, and to learn how to make
                choices regarding certain Personal Information collection and
                processing activities, please see our{' '}
                <a href="/privacy">Privacy Policy</a>.
              </span>
            </p>
          </li>
          <li>
            <h3>Disclaimers</h3>
            <ol>
              <li>
                <span>Disclaimer of Warranties</span>
                <p>
                  <strong>
                    WE MAKE NO REPRESENTATIONS OR WARRANTIES WITH RESPECT TO THE
                    PLATFORM, INCLUDING, BUT NOT LIMITED TO, ANY SERVICES,
                    CONTENT, OR ANY INVESTMENT AVAILABLE ON OR PROMOTED THROUGH
                    THE PLATFORM. THE PLATFORM, AND ALL OF THE INFORMATION,
                    INVESTMENTS, AND SERVICES MADE AVAILABLE THROUGH THE
                    INVESTOR PORTAL ARE PROVIDED ON AN “AS IS,” “AS AVAILABLE”
                    BASIS, WITHOUT REPRESENTATIONS OR WARRANTIES OF ANY KIND. TO
                    THE FULLEST EXTENT PERMITTED BY LAW, WE AND OUR AFFILIATES
                    DISCLAIM ANY AND ALL REPRESENTATIONS AND WARRANTIES, WHETHER
                    EXPRESS OR IMPLIED, WITH RESPECT TO THE PLATFORM, INCLUDING,
                    BUT NOT LIMITED TO, ANY SERVICES, CONTENT OR INVESTMENTS
                    MADE AVAILABLE THROUGH THE PLATFORM. WITHOUT LIMITING THE
                    GENERALITY OF THE FOREGOING, WE AND OUR AFFILIATES DISCLAIM
                    ALL REPRESENTATIONS AND WARRANTIES, EXPRESS OR IMPLIED, (A)
                    OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR
                    A PARTICULAR PURPOSE; (B) ARISING FROM COURSE OF DEALING OR
                    COURSE OF PERFORMANCE; (C) RELATING TO THE SECURITY OF THE
                    PLATFORM; (D) THAT THE CONTENT OF THE PLATFORM IS ACCURATE,
                    COMPLETE, CURRENT, RELIABLE; (E) THAT THE PLATFORM WILL MEET
                    YOUR OR ANY THIRD PARTY’S REQUIREMENTS, ACHIEVE ANY INTENDED
                    RESULTS, BE COMPATIBLE OR WORK WITH ANY OTHER SOFTWARE,
                    APPLICATIONS, SYSTEMS OR SERVICES, OPERATE WITHOUT
                    INTERRUPTION, MEET ANY PERFORMANCE OR RELIABILITY STANDARDS;
                    AND (F) THAT THE PLATFORM WILL OPERATE WITHOUT INTERRUPTION
                    OR ERROR.{' '}
                  </strong>
                </p>
                <p>
                  <strong>
                    WE DO NOT MAKE ANY REPRESENTATIONS OR WARRANTIES AGAINST THE
                    POSSIBILITY OF DELETION, MIS-DELIVERY OR FAILURE TO STORE
                    COMMUNICATIONS, PERSONALIZED SETTINGS OR OTHER DATA,
                    INCLUDING, WITHOUT LIMITATION AND AS APPLICABLE, YOUR USER
                    CONTENT OR OTHER INFORMATION YOU SUBMIT THROUGH OR IN
                    CONNECTION WITH YOUR ACCESS TO OR USE OF THE PLATFORM.
                  </strong>
                </p>
                <p>
                  <strong>
                    WE ARE NOT RESPONSIBLE OR LIABLE FOR, NOR DO WE REPRESENT OR
                    OTHERWISE WARRANT THE PERFORMANCE OF ANY DEVICE YOU USE TO
                    ACCESS OR USE THE PLATFORM, INCLUDING, WITHOUT LIMITATION,
                    THE CONTINUING COMPATIBILITY OF ANY DEVICE WITH THE
                    PLATFORM.
                  </strong>
                </p>
              </li>
              <li>
                <span>Exceptions</span>
                <p>
                  <strong>
                    SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN
                    WARRANTIES. ACCORDINGLY, SOME OF THE ABOVE DISCLAIMERS OF
                    WARRANTIES MAY NOT APPLY TO YOU.
                  </strong>
                </p>
              </li>
            </ol>
          </li>
          <li>
            <h3>Indemnity</h3>
            <ol>
              <li>
                <span>
                  YOU AGREE TO INDEMNIFY AND HOLD NEUTRAL, ITS AFFILIATES, AND
                  EACH OF ITS RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES,
                  SHAREHOLDERS, PARTNERS AND AGENTS (COLLECTIVELY, THE “
                </span>
                <strong>INDEMNIFIED PARTIES</strong>
                <span>
                  ”) HARMLESS FROM AND AGAINST ANY AND ALL CLAIMS, LIABILITY,
                  LOSSES, DAMAGES, COSTS AND EXPENSES (INCLUDING REASONABLE
                  LEGAL FEES) INCURRED BY ANY INDEMNIFIED PARTY ARISING OUT OF,
                  AS A RESULT OF OR IN CONNECTION WITH ANY BREACH OR ALLEGED
                  BREACH BY YOU OR ANYONE ACTING ON YOUR BEHALF OF ANY OF THE
                  PROVISIONS OF THESE TERMS OR YOUR USE OF THE PLATFORM,
                  INCLUDING REASONABLE ATTORNEYS’ FEES, MADE BY ANY THIRD PARTY
                  DUE TO OR ARISING OUT OF YOUR ACCESS TO OR USE OF THE
                  PLATFORM, YOUR VIOLATION OF THESE TERMS, OR YOUR VIOLATION OF
                  ANY INTELLECTUAL PROPERTY RIGHTS OF ANY OTHER PERSON OR
                  ENTITY.
                </span>
              </li>
              <li>
                <strong>Additional Remedies.</strong>
                <span>
                  {' '}
                  The Indemnified Parties reserve the right to seek all remedies
                  available at law and in equity for your violation of these
                  Terms, including the right to block access from a particular
                  internet address to the Platform and report misuses to law
                  enforcement.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <h3>Limitations of Liability</h3>
            <ol>
              <li>
                <span>
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, AND WITHOUT
                  LIMITING ANYTHING ELSE IN THESE TERMS, OUR ENTIRE LIABILITY,
                  AND YOUR EXCLUSIVE REMEDY, WITH RESPECT TO THE USE OF THE
                  PLATFORM SHALL BE THE AMOUNT OF $100.
                </span>
              </li>
              <li>
                <span>
                  IN NO EVENT WILL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                  SPECIAL, EXEMPLARY, PUNITIVE, OR CONSEQUENTIAL DAMAGES ARISING
                  FROM YOUR USE OF THE PLATFORM OR FOR ANY OTHER CLAIM RELATED
                  IN ANY WAY TO YOUR USE OF THE PLATFORM.
                </span>
              </li>
              <li>
                <span>
                  THE FOREGOING LIMITATIONS WILL APPLY WHETHER SUCH DAMAGES
                  ARISE OUT OF BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE)
                  OR OTHERWISE AND REGARDLESS OF WHETHER SUCH DAMAGES WERE
                  FORESEEABLE OR WE WERE ADVISED OF THE POSSIBILITY OF SUCH
                  DAMAGES.{' '}
                </span>
              </li>
              <li>
                <span>
                  SOME STATES OR JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS
                  OF LIABILITY, SO SOME OF THE ABOVE LIMITATIONS OF LIABILITY
                  MAY NOT APPLY TO YOU. IN SUCH STATES OR JURISDICTIONS, OUR
                  LIABILITY WILL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY
                  APPLICABLE LAW.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <h3>Confidentiality</h3>
            <ol>
              <li>
                <span>
                  Should you receive information from Neutral or through the
                  Investor Portal with respect to any investment activity, you
                  may not further disclose or otherwise provide such information
                  to another party.
                </span>
              </li>
              <li>
                <span>
                  You are entrusted with any information you receive on the
                  Investor Portal from Neutral, or other investors with respect
                  to any investment activity. You acknowledge and agree to keep
                  such information confidential. To the extent you opt not to
                  review such confidential documents about potential
                  investments, you acknowledge and agree that you assume the
                  risk that such additional information may be relevant to your
                  decision to invest in a particular investment opportunity, and
                  you knowingly accept the risks of not reviewing such
                  information.
                </span>
              </li>
              <li>
                <span>
                  You agree that Neutral, at its sole discretion and to the
                  extent permitted by law, may access, read, preserve and
                  disclose your account information, usage history and submitted
                  content in order to: (i) comply with any applicable law,
                  regulation, legal process, or governmental request; (ii)
                  respond to claims that any such content violates the rights of
                  third parties, including intellectual property rights; (iii)
                  enforce these Terms and investigate potential violations
                  thereof; (iv) detect, prevent, or otherwise address fraud,
                  security, or technical issues; (v) respond to your requests
                  for customer service; or (vi) protect the rights, property, or
                  personal safety of Neutral, users of the Investor Portal, or
                  the public.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <h3>DMCA Notice</h3>
            <ol>
              <li>
                <span>
                  Neutral respects the intellectual property rights of others
                  and has established the following procedure for receiving
                  notice of infringement in compliance with the Digital
                  Millennium Copyright Act (DMCA). Notices should be submitted
                  to Neutral's copyright agent via email:
                </span>
                <span>
                  <a href="mailto:invest@neutral.us">invest@neutral.us</a>
                </span>
                <span> (subject line: DMCA Takedown Request).</span>
              </li>
              <li>
                <span>To be effective, the notice should include:</span>
                <ol>
                  <li>
                    <span>
                      A physical or electronic signature of a person authorized
                      to act on behalf of the owner of an exclusive right that
                      is allegedly infringed;
                    </span>
                  </li>
                  <li>
                    <span>
                      Identification of the copyrighted work claimed to have
                      been infringed, or, if multiple copyrighted works are
                      covered by a single notification, a representative list of
                      such works;
                    </span>
                  </li>
                  <li>
                    <span>
                      Identification of the material that is claimed to be
                      infringing or to be the subject of infringing activity and
                      that is to be removed or access to which is to be
                      disabled, and information reasonably sufficient to permit
                      Neutral to locate the material on the Platform;
                    </span>
                  </li>
                  <li>
                    <span>
                      Information reasonably sufficient to permit Neutral to
                      contact the complaining party, such as an address,
                      telephone number, and, if available, an email address;
                    </span>
                  </li>
                  <li>
                    <span>
                      A statement that the complaining party has a good faith
                      belief that use of the material in the manner complained
                      of is not authorized by the copyright owner, its agent, or
                      the law;
                    </span>
                  </li>
                  <li>
                    <span>
                      A statement that the information in the notification is
                      accurate, and under penalty of perjury, that the
                      complaining party is authorized to act on behalf of the
                      owner of an exclusive right that is allegedly infringed.
                    </span>
                  </li>
                </ol>
              </li>
            </ol>
          </li>
          <li>
            <strong>Third Party Websites</strong>
            <p>
              <span>
                Solely for your convenience, the Platform may include links to
                websites and other online resources operated or provided by
                third parties. These links are provided for your convenience
                only. We have no control over the content of those websites or
                resources. We are not responsible for examining or evaluating
                the content or accuracy of, and does not warrant or endorse, any
                third-party website, resource, or any programs, products, or
                services made available through those websites or resources. If
                you decide to access any of the third-party websites that are
                linked to this Platform, you do so entirely at your own risk and
                subject to the terms and conditions of use for such websites.
              </span>
            </p>
          </li>
          <li>
            <strong>
              Your Consent to Electronic Transactions & Disclosures
            </strong>
            <ol>
              <li>
                <span>
                  As part of doing business with Neutral, you consent to our
                  provision of certain disclosures electronically, either via
                  our Investor Portal or to the email address you provide to us.
                  You further agree to receiving electronically all documents,
                  communications, notices, contracts, and agreements, including
                  any IRS tax forms, schedules or information statements,
                  arising from, in connection with or relating to your
                  registration as an investor on the Investor Portal, any
                  investments you may make, your use of the Investor Portal, and
                  the servicing of any investment you may make (each, a “
                </span>
                <strong>Disclosure</strong>
                <span>
                  ”), from Neutral or any service provider we may use. The
                  decision to do business with Neutral electronically is yours.
                  You agree that these Terms sufficiently informs you of your
                  rights concerning Disclosures.
                </span>
              </li>
              <li>
                <span>
                  Your consent to receive Disclosures and transact business
                  electronically, and our agreement to do so, applies to any
                  transaction to which such Disclosures relate. Your consent
                  will remain in effect for as long as you have an account with
                  the Investor Portal.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <strong>Termination</strong>
            <ol>
              <li>
                <span>
                  Notwithstanding anything in these Terms, Neutral reserves the
                  right, without notice and in its sole discretion, to terminate
                  these Terms and/or your account, to block your use of the
                  Platform and/or to remove any Content. Further, Neutral may
                  also in its sole discretion and, at any time, discontinue
                  providing the Platform, or any part thereof, with or without
                  notice.{' '}
                </span>
              </li>
              <li>
                <span>
                  You agree that Neutral will not be liable to you or any third
                  party for any termination of your access to the Platform. Upon
                  termination of these Terms for any reason, all rights to the
                  Platform granted by Neutral to you will immediately cease to
                  exist and you shall discontinue all use of the Platform.
                </span>
              </li>
              <li>
                <span>
                  If we suspect that you are engaging in any fraudulent,
                  abusive, or illegal activity, we may refer such matter to
                  appropriate law enforcement authorities.{' '}
                </span>
              </li>
              <li>
                <span>The provisions</span>
                <span> </span>
                <span>of</span>
                <span> </span>
                <span>
                  these Terms which by their nature are intended to survive the
                  termination or cancellation of these Terms shall continue as
                  valid and enforceable obligations notwithstanding any such
                  termination or cancellation. Without limiting the foregoing,
                  the provisions of these Terms regarding indemnity, limitations
                  of liability and dispute resolution shall survive the
                  termination or cancellation of these Terms.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <strong>Violation of Agreement</strong>
            <ol>
              <li>
                <span>
                  Neutral reserves the right to seek all remedies available at
                  law and in equity for violations of these Terms, including the
                  right to block access from a particular internet address to
                  the Platform, or report misuses to law enforcement.
                </span>
              </li>
              <li>
                <span>
                  The failure of Neutral to exercise or enforce any right or
                  provision of these Terms shall not constitute a waiver of such
                  right or provision.
                </span>
              </li>
            </ol>
          </li>
          <li>
            <h3>Governing Law and Forum</h3>
            <p>
              <span>
                These Terms will be governed by the laws of the State of
                Wisconsin without giving effect to its conflicts of laws
                principles. All claims or disputes arising from or relating in
                any way to the subject matter of these Terms or your access to
                or use of the Platform must be brought exclusively in the United
                States District Court for the Western District of Wisconsin or
                the courts of the State of Wisconsin with jurisdiction over Dane
                County, Wisconsin, as appropriate. Unless prohibited by
                applicable law, you agree to submit to the personal jurisdiction
                of each of these courts for the purpose of resolving such claims
                or disputes.
              </span>
            </p>
          </li>
          <li>
            <h3>Third-Party Beneficiaries</h3>
            <p>
              <span>
                Except as otherwise provided in these Terms, these Terms does
                not confer any rights, remedies, or benefits upon any person
                other than you and Neutral.
              </span>
            </p>
          </li>
          <li>
            <h3>Force Majeure</h3>
            <p>
              <span>
                Neutral shall not be liable for any delay in performing, or
                failure to perform its obligations under these Terms or the
                performance of any portion of the Platform resulting from any
                cause beyond its reasonable control, including, without
                limitation, acts of God, fire, strikes, energy interruptions,
                labor disputes, natural disaster, flood, earthquake, epidemics,
                inability to obtain equipment, supplies or other facilities,
                terrorism, criminal activity, governmental demands or
                requirements, war (declared or undeclared), or the acts of
                government (each, a “
              </span>
              <strong>Force Majeure Event</strong>
              <span>
                ”). If affected by a Force Majeure Event, Neutral shall be
                excused from performance to the extent prevented by such event.
              </span>
            </p>
          </li>
          <li>
            <h3>Severability</h3>
            <p>
              <span>
                If any part of these Terms is determined to be invalid or
                unenforceable pursuant to applicable law, including, but not
                limited to, the warranty disclaimers and limitations of
                liability set forth above, then the invalid or unenforceable
                provision will be deemed superseded by a valid, enforceable
                provision that most closely matches the intent of the original
                provision and the remainder of these Terms shall continue in
                effect.
              </span>
            </p>
          </li>
          <li>
            <h3>Headings</h3>
            <p>
              <span>
                The section headings and sub-headings contained in these Terms
                are for convenience only and have no legal or contractual
                effect.
              </span>
            </p>
          </li>
          <li>
            <h3>Contact Us</h3>
            <p>
              <span>
                If you have any questions or concerns about the Platform, any of
                our Services, or these Terms, please contact us using the
                following information:
              </span>
            </p>
            <p>
              <span>By email: </span>
              <span>
                <a href="mailto:invest@neutral.us">invest@neutral.us</a>
              </span>
            </p>
            <p>
              <span>By mail: 25 W Main St Unit 500</span>
            </p>
            <p>
              <span>Madison WI 53703</span>
            </p>
          </li>
        </ol>
      </StyledContent>
    </Box>
  );
};

export default TermsPage;
