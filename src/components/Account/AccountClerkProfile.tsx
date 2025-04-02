'use client';

import React from 'react';
import { UserProfile } from '@clerk/nextjs';

const AccountClerkProfile = () => {
  return (
    <div className="w-full">
      <style jsx global>{`
        /* Target both classes for better resilience */
        .cl-cardBox {
          width: 100% !important;
          max-width: 100% !important;
        }
      `}</style>

      <UserProfile
        routing="hash"
        appearance={{
          elements: {
            rootBox: {
              width: '100%',
              maxWidth: '100%',
            },
            card: {
              width: '100%',
              maxWidth: '100%',
            },
          },
        }}
      />
    </div>
  );
};

export default AccountClerkProfile;
