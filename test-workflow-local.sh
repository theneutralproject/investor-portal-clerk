#!/bin/bash


#To run:
#1) Install act
# On macOS
#brew install act

# On Linux
#curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

#2) chmod +x test-workflow-local.sh

#3) ./test-workflow-local.sh


# Load environment variables
set -a
source .env
source local.env
set +a


# Install npm dependencies
npm ci

# Install Playwright browser
npx playwright install-deps chromium

# Run tests
DEBUG=pw:browser npx playwright test