### Playwright Testing
Playwright is an end to end testing framework. 
We can use it for both frontend tests (this is where it really shines), and API unit tests.

#### How to:
`npm run test:e2e` will launch Playwright in [UI mode](https://playwright.dev/docs/test-ui-mode)
Using the Playwright UI, you can inspect the response body, any console logs that your tests contain, and so on. You can also visually inspect what the browser renders for any of the tests.

#### Frontend Tests
For frontend tests, it is configured to work with our Clerk dev instance. A test user that is stored in clerk can authenticate via clerk, and then use its cookie to make frontend requests.


#### Backend Tests
For backend tests, we need to use a Bearer Auth Token, which is stored in our env vars. In our `playwright.config.ts` file, we make sure that every backend request uses this token.  