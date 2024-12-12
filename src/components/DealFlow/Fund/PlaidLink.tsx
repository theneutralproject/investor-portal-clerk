/* eslint-disable */
import axios from "axios";
import React from "react";

import {
  PlaidLink,
  PlaidLinkOnSuccess,
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";
import { toast } from "react-toastify";

interface Props {
  dealId: number;
  merchantId: string;
  projectSlug: string;
  refetchDeal: () => Promise<void>;
}
interface State {
  token: null | string;
}
class PlaidLinkClass extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { token: null };
  }
  async createLinkToken() {
    const response = await fetch("/api/finix/plaidLinkToken", {
      method: "POST",
      body: JSON.stringify({
        "slug": this.props.projectSlug,
      })
    });
    const link_token = await response.json();
    return link_token;
  }

  async componentDidMount() {
    const token = await this.createLinkToken();
    this.setState({ token });
  }

  onSuccess: PlaidLinkOnSuccess = async (publicToken, metadata) => {
    const fullMetadata = metadata as PlaidLinkOnSuccessMetadata & {
      account_id: string;
    };

    console.log("merchantId:", this.props.merchantId);
    const FinixAuth = window.Finix.Auth(
      "sandbox",
      this.props.merchantId,
      async (sk: string) => {
        console.log("sessionKey", sk);

        // https://plaid.com/docs/api/tokens/#token-exchange-flow
        const res = await axios
          .post("/api/finix/transaction", {
            plaid_public_token: publicToken,
            plaid_account_id: fullMetadata.account_id,
            dealId: this.props.dealId,
            sessionKey: sk,
            merchantId: this.props.merchantId,
            slug: this.props.projectSlug,
          })
          .catch((error) => {
            console.error("Finix transaction error", error);
            const errorMessage = error.response.data.error;
            toast.error(errorMessage);
            return error.response;
          });

        if (res.status === 200) {
          const { message } = res.data;
          console.log(message);
          toast.success(message);
          //refetch the deal
          await this.props.refetchDeal();
          // TODO: show success message: https://linear.app/neutralus/issue/NTRL-183/ux-revise-ach-payment-step
          // TODO: disable the button to avoid multiple clicks
        }
      }
    );
  };

  onEvent: PlaidLinkOnEvent = (eventName, metadata) => {
    console.log("onEvent:");
    // log onEvent callbacks from Link
    // https://plaid.com/docs/link/web/#onevent
    console.log(eventName, metadata);
  };

  onExit: PlaidLinkOnExit = (error, metadata) => {
    console.log("onExit:");
    // log onExit callbacks from Link, handle errors
    // https://plaid.com/docs/link/web/#onexit
    console.log(error, metadata);
    // TODO: handle and display error
  };

  render() {
    return (
      <PlaidLink
        className="CustomButton"
        style={{
          padding: "8px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        token={this.state.token}
        onSuccess={this.onSuccess}
        onEvent={this.onEvent}
        onExit={this.onExit}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{ color: "white" }}
        >
          <path
            fill="currentColor"
            d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"
          />
        </svg>
        Connect Your Bank Account
      </PlaidLink>
    );
  }
}

export default PlaidLinkClass;
/* eslint-enable */
