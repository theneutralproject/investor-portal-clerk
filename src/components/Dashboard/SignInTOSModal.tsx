'use client';

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
import { useTermsContext } from '@/app/context/TermsContext';

const SignInTOSModal = () => {
  const { acceptTerms, showModal } = useTermsContext();
  const pathname = usePathname();

  if (pathname === '/terms' || pathname === '/privacy') {
    return null;
  }

  return (
    <Dialog
      open={showModal}
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
            onClick={acceptTerms}
            variant="neutralRustTerracotta"
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
