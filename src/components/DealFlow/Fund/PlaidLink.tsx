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
                style={{
                    padding: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
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
                    style={{color: 'white'}}
                >
                    <path 
                        fill="currentColor" 
                        d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"
                    />
                </svg>
                Connect Bank Account
            </PlaidLink>
        );
    }
}

export default PlaidLinkClass;
/* eslint-enable */
