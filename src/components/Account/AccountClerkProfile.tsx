'use client';

import React from 'react';
import { UserProfile } from '@clerk/nextjs';

const AccountClerkProfile = () => {
  return <UserProfile routing="hash" />;
};

export default AccountClerkProfile;
