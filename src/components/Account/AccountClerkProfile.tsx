'use client';

import React from 'react';
import { UserProfile } from '@clerk/nextjs';
import { Card, CardContent, Typography, Box } from '@mui/material';

const AccountClerkProfile = () => {
  return (
    <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Account Authentication
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your email, password, and account security preferences.
        </Typography>

        <Box className="w-full">
          <style jsx global>{`
            /* Target both classes for better resilience */
            .cl-cardBox,
            .cl-card {
              width: 100% !important;
              max-width: 100% !important;
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }

            /* Remove default Clerk card styling */
            .cl-card {
              background: transparent !important;
            }

            /* Style section headings to match MUI */
            .cl-formButtonPrimary {
              background-color: #1976d2 !important;
              font-family:
                'Roboto', 'Helvetica', 'Arial', sans-serif !important;
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
                  boxShadow: 'none',
                  border: 'none',
                  padding: 0,
                },
                navbar: {
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                },
                headerTitle: {
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                },
                headerSubtitle: {
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                },
                formButtonPrimary: {
                  backgroundColor: '#1976d2',
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountClerkProfile;
