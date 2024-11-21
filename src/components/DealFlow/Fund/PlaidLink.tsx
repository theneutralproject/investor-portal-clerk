/* eslint-disable */
import React from 'react';

import {
    PlaidLink,
    PlaidLinkOnSuccess,
    PlaidLinkOnEvent,
    PlaidLinkOnExit,
} from 'react-plaid-link';


interface Props { }
interface State {
    token: null | string;
}
class PlaidLinkClass extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { token: null };
    }
    async createLinkToken() {
        const response = await fetch('/api/finix/plaidLinkToken', { method: 'POST' });
        const link_token = await response.json();
        return link_token;
    }

    async componentDidMount() {
        const token = await this.createLinkToken();
        this.setState({ token });
    }

    onSuccess: PlaidLinkOnSuccess = (publicToken, metadata) => {
        // send public_token to your server
        // https://plaid.com/docs/api/tokens/#token-exchange-flow
        console.log(publicToken, metadata);
    };

    onEvent: PlaidLinkOnEvent = (eventName, metadata) => {
        // log onEvent callbacks from Link
        // https://plaid.com/docs/link/web/#onevent
        console.log(eventName, metadata);
    };

    onExit: PlaidLinkOnExit = (error, metadata) => {
        // log onExit callbacks from Link, handle errors
        // https://plaid.com/docs/link/web/#onexit
        console.log(error, metadata);
    };

    render() {
        return (
            <PlaidLink
                className="CustomButton"
                style={{ padding: '20px', fontSize: '16px', cursor: 'pointer' }}
                token={this.state.token}
                onSuccess={this.onSuccess}
                onEvent={this.onEvent}
                onExit={this.onExit}
            >
                Link your bank account
            </PlaidLink>
        );
    }
}

export default PlaidLinkClass;
/* eslint-enable */
