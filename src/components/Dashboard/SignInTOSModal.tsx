'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  Link,
} from '@mui/material';
import { usePathname } from 'next/navigation';

const LOCAL_STORAGE_KEY = 'tos_modal_shown';

const SignInTOSModal = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const hasShownModal = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!hasShownModal && pathname !== '/terms' && pathname !== '/privacy') {
      setOpen(true);
    }
  }, [pathname]);

  const handleContinue = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setOpen(false);
  };

  if (pathname === '/terms' || pathname === '/privacy') {
    return null;
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby="tos-dialog"
      PaperProps={{
        style: {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Card sx={{ maxWidth: 500 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            We&apos;ve updated our terms and conditions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" underline="hover">
              terms
            </Link>{' '}
            and have read our{' '}
            <Link href="/privacy" underline="hover">
              privacy policy
            </Link>
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button
            onClick={handleContinue}
            variant="neutralYellow"
            color="primary"
          >
            Continue
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  );
};

export default SignInTOSModal;
