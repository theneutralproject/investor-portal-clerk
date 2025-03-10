/* eslint-disable */
import axios from 'axios';
import React from 'react';
import { CircularProgress } from '@mui/material';
import {
  PlaidLink,
  PlaidLinkOnSuccess,
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOnSuccessMetadata,
} from 'react-plaid-link';
import { toast } from 'react-toastify';
import Logger from '@/libs/logger';

const PLAID_ERROR_MESSAGE =
  'We are unable to complete the bank connection. Please refresh your browser window and try again. Contact a member of the team if the problem persists.';

interface Props {
  dealId: number;
  merchantId: string;
  projectSlug: string;
  refetchDeal: () => Promise<void>;
}
interface State {
  token: null | string;
  isLoading: boolean;
}
class PlaidLinkClass extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { token: null, isLoading: false };
  }
  async createLinkToken() {
    try {
      const response = await fetch('/api/finix/plaidLinkToken', {
        method: 'POST',
        body: JSON.stringify({
          slug: this.props.projectSlug,
        }),
      });
      if (!response.ok) {
        Logger.error('Failed to create plaidLinkToken', null, {
          response: await response.json(),
        });
        throw new Error('Failed to create link token');
      }
      const link_token = await response.json();
      return link_token;
    } catch (error) {
      toast.error(PLAID_ERROR_MESSAGE);
      return null;
    }
  }

  async componentDidMount() {
    const token = await this.createLinkToken();
    this.setState({ token });
  }

  onSuccess: PlaidLinkOnSuccess = async (publicToken, metadata) => {
    this.setState({ isLoading: true });
    const fullMetadata = metadata as PlaidLinkOnSuccessMetadata & {
      account_id: string;
    };
    Logger.log({ message: 'PlaidLinkOnSuccess', extra: fullMetadata });

    try {
      console.log('merchantId:', this.props.merchantId);
      const FinixAuth = window.Finix.Auth(
        'sandbox',
        this.props.merchantId,
        async (sk: string) => {
          console.log('sessionKey', sk);

          // https://plaid.com/docs/api/tokens/#token-exchange-flow
          const res = await axios.post('/api/finix/transaction', {
            plaid_public_token: publicToken,
            plaid_account_id: fullMetadata.account_id,
            dealId: this.props.dealId,
            sessionKey: sk,
            merchantId: this.props.merchantId,
            slug: this.props.projectSlug,
          });

          if (res.status === 200) {
            const { message } = res.data;
            console.log(message);
            toast.success(message);
            await this.props.refetchDeal();
          } else {
            throw new Error('Failed to process transaction');
          }
        }
      );
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(PLAID_ERROR_MESSAGE);
      this.setState({ isLoading: false });
    }
  };

  onEvent: PlaidLinkOnEvent = (eventName, metadata) => {
    if (eventName === 'OPEN') {
      this.setState({ isLoading: true });
    }
    if (eventName === 'ERROR') {
      Logger.error('PlaidLinkOnEvent Error:', null, { metadata, eventName });
      toast.error(PLAID_ERROR_MESSAGE);
      this.setState({ isLoading: false });
    }
    console.log('onEvent:', eventName, metadata);
  };

  onExit: PlaidLinkOnExit = (error, metadata) => {
    this.setState({ isLoading: false });
    console.log('onExit:', error, metadata);

    if (error) {
      toast.error(PLAID_ERROR_MESSAGE);
      Logger.error('PlaidLinkOnExit Error:', null, { metadata });
    }

    if (
      metadata.status === 'requires_credentials' ||
      !metadata.link_session_id
    ) {
      toast.info(
        'Bank connection was not completed. Please try again when ready.'
      );
      Logger.error('PlaidLinkOnExit requires_credentials:', null, {
        metadata,
        disableSentry: true,
      });
    }
  };

  render() {
    return (
      <PlaidLink
        className="CustomButton"
        style={{
          padding: '8px',
          fontSize: '16px',
          cursor: this.state.isLoading ? 'not-allowed' : 'pointer',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: this.state.isLoading ? 0.7 : 1,
        }}
        token={this.state.token}
        onSuccess={this.onSuccess}
        onEvent={this.onEvent}
        onExit={this.onExit}
      >
        {this.state.isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ color: 'white' }}
          >
            <path
              fill="currentColor"
              d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"
            />
          </svg>
        )}
        Connect Your Bank Account
      </PlaidLink>
    );
  }
}

export default PlaidLinkClass;
/* eslint-enable */
