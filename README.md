# Investor Portal

npm i
npm run dev

## Clerk in Development mode
to test clerk in development mode, use localtunnel in a separate terminal tab:
`npx lt --port 3000 --subdomain neutral-invest`

You also need to ensure that the webhooks in clerk are still enabled. Clerk tends to turn off webhooks if they fail repeatedly. Do so by logging into the clerk dashboard and looking at our webhook.


## Testing

