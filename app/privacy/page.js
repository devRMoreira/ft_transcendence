import { Box, Container, Link, Stack, Typography } from "@mui/material";

export const metadata = {
  title: "Privacy Policy | CardGame",
  description: "Privacy information for the CardGame student project.",
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
            <Typography component="h2" variant="h5" gutterBottom>1. About this project</Typography>
            <Typography>
              CardGame is a student project created by learners in the 42 Network curriculum as part of their final ft_transcendence project. It is a prototype built for educational, demonstration, and evaluation purposes, not a commercial product or a service offered to customers. This notice describes the data handled by the version of the application currently deployed by the student team.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>2. Information handled by the application</Typography>
            <Typography>
              When you register, the application stores your display name, email address, and a password hash. Plain-text passwords are not stored by the application.
            </Typography>
            <Typography>
              Features may also store data you submit or generate while testing the prototype, including friend relationships, direct messages, group memberships, group posts, invitations, join requests, match participation, match results, active-match state, and timestamps.
            </Typography>
            <Typography>
              Authentication uses session information to keep you signed in. The current project does not intentionally collect precise location, contacts, payment information, advertising profiles, or biometric data.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>3. Why data is used</Typography>
            <Typography>
              Data is used only to implement, test, demonstrate, secure, and evaluate the project features, including authentication, matches, groups, friends, profiles, and messaging. The project is not used for targeted advertising and personal information is not sold.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>4. Visibility and hosting</Typography>
            <Typography>
              Other users may see your display name and information made available through friends, groups, posts, and matches. Direct messages are intended to be visible to their sender and recipient. Depending on the deployment, project data may be processed by the hosting, database, or infrastructure providers used by the student team. The project may also be reviewed by 42 Network staff or evaluators as part of the curriculum.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>5. Retention and deletion</Typography>
            <Typography>
              This is not a production service and no permanent availability or retention period is promised. Data may be reset, deleted, or lost when the project is redeployed, evaluated, archived, or taken offline. For a deletion or access request, contact the student team or the administrator of the deployment you are using. Backups or records retained for academic evaluation may take time to be removed.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>6. Security</Typography>
            <Typography>
              The project uses authentication, access controls, and password hashing appropriate for a student prototype. It has not been represented as a certified or production-grade security system. Do not use a password that you use elsewhere, and avoid submitting sensitive or confidential information. Report suspected account compromise to the student team or deployment administrator.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>7. Your choices</Typography>
            <Typography>
              You may choose not to create an account or may stop using the prototype at any time. Depending on your location, applicable privacy law may give you rights to access, correct, or delete personal information. Requests should be sent to the student team or deployment administrator, who may need to verify your identity. This educational notice does not limit any rights that the law gives you.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>8. Changes and contact</Typography>
            <Typography>
              The student team may update this notice as the project changes. The effective date above identifies the current version. For privacy questions or requests, use the contact details provided by the student team or the administrator of the deployment. This document is project documentation, not legal advice, and should be reviewed by the responsible educational institution before any public or commercial use.
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}