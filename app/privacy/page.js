import { Box, Container, Link, Stack, Typography } from "@mui/material";

export const metadata = {
  title: "Privacy Policy | CardGame",
  description: "How CardGame collects, uses, and protects personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={4}>
        <Box>
          <Link href="/" underline="hover">
            Back to CardGame
          </Link>
          <Typography component="h1" variant="h3" sx={{ mt: 3, mb: 1 }}>
            Privacy Policy
          </Typography>
          <Typography color="text.secondary">Effective date: September 20, 2026</Typography>
        </Box>

        <Stack spacing={3}>
          <Box>
            <Typography component="h2" variant="h5" gutterBottom>1. Scope</Typography>
            <Typography>
              This Privacy Policy explains how CardGame collects, uses, stores, and shares information when you create an account or use our card-game, social, group, and messaging features. CardGame is a project operated by its development team and is not intended for children under 13.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>2. Information we collect</Typography>
            <Typography>
              When you register, we collect your display name, email address, and a password credential. Passwords are stored as one-way password hashes; we do not store your plain-text password.
            </Typography>
            <Typography>
              When you use the service, we store content and activity needed to provide it, including friend relationships, direct messages, group memberships, group posts, invitations, join requests, match participation, match results, and the state needed to continue an active match. We also store account creation and feature timestamps.
            </Typography>
            <Typography>
              Authentication creates session information so that we can keep you signed in. We do not intentionally collect precise location, contacts, payment information, or advertising profiles through the current service.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>3. How we use information</Typography>
            <Typography>
              We use information to create and secure accounts, authenticate users, operate matches, deliver messages and group features, show your profile to other users where the feature requires it, prevent abuse, troubleshoot failures, and maintain the service. We do not sell personal information or use message content for targeted advertising.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>4. Who can see your information</Typography>
            <Typography>
              Other users may see your display name and the content or activity you choose to make available through friends, groups, posts, and matches. Direct messages are visible to their sender and recipient. We may share information with hosting, database, authentication, and infrastructure providers only as needed to operate the service, or when required by law, to protect rights and safety, or to investigate misuse.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>5. Retention and deletion</Typography>
            <Typography>
              We retain information for as long as it is needed to provide the service, meet security and legal obligations, resolve disputes, and enforce our terms. You may request account and personal-data deletion from the CardGame project maintainers through the project repository or the administrator of the deployment you use. Some records may remain where retention is legally required or necessary to protect the service; content already shared with other users may also survive in backups or references for a limited period.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>6. Security</Typography>
            <Typography>
              We use access controls, authenticated sessions, and password hashing designed to reduce unauthorized access. No online service can guarantee absolute security. Do not reuse a password from another service, and tell the project maintainers promptly if you believe your account is compromised.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>7. Your choices and rights</Typography>
            <Typography>
              Depending on where you live, you may have rights to access, correct, export, restrict, or delete your personal information, and to object to or limit certain processing. You can update information through the available profile features or submit a request to the project maintainers. We may need to verify your identity before completing a request.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>8. Changes and contact</Typography>
            <Typography>
              We may update this Policy when the service or applicable requirements change. The effective date above identifies the current version; material changes will be announced in the service where practical. For privacy questions or requests, contact the CardGame project maintainers through the official project repository or the administrator of your deployment.
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}