import { Box, Container, Link, Stack, Typography } from "@mui/material";

export const metadata = {
  title: "Terms of Service | CardGame",
  description: "Terms for the CardGame student project.",
};

export default function TermsOfServicePage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={4}>
        <Box>
          <Link href="/" underline="hover">
            Back to CardGame
          </Link>
          <Typography component="h1" variant="h3" sx={{ mt: 3, mb: 1 }}>
            Terms of Use
          </Typography>
          <Typography color="text.secondary">Effective date: September 20, 2026</Typography>
        </Box>

        <Stack spacing={3}>
          <Box>
            <Typography component="h2" variant="h5" gutterBottom>1. Educational project</Typography>
            <Typography>
                CardGame is a student project developed by learners in the 42 Network curriculum for the final ft_transcendence project. It is a prototype for learning, demonstration, and academic evaluation. It is not a commercial product, paid service, or production platform. By creating an account or using the prototype, you agree to these Terms of Use. If you do not agree, do not use it.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>2. Accounts</Typography>
            <Typography>
              Provide reasonably accurate information, keep your credentials confidential, and remain responsible for activity performed through your account. Do not impersonate another person, create accounts through automated means, or use another person&apos;s account. The student team may reset or remove accounts as part of development or evaluation. Notify the team or deployment administrator if you suspect unauthorized access.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>3. Acceptable use</Typography>
            <Typography>
              Use the prototype only for lawful educational, testing, or recreational purposes. Do not harass, threaten, defame, or target other users; publish illegal, hateful, sexually explicit, or harmful material; send spam or malicious code; exploit bugs; interfere with matches or the application; attempt unauthorized access; scrape or collect user information; or violate another person&apos;s rights or applicable law.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>4. User content and moderation</Typography>
            <Typography>
              You retain ownership of content you submit. You allow the project to store, display, and transmit that content only as needed to run and evaluate the features you use. You are responsible for your content and must have the right to submit it. The student team or educational evaluators may remove content or restrict accounts that breach these Terms, create risk, or interfere with the project. Do not submit confidential, sensitive, or valuable content because this is an educational prototype.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>5. Game rules and service availability</Typography>
            <Typography>
              Match outcomes and features may change during development. The application may be unavailable, reset, modified, or discontinued at any time, including for demonstrations, grading, maintenance, or deployment changes. Saved state and other data may be lost. Do not rely on CardGame as a storage service.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>6. Intellectual property</Typography>
            <Typography>
              The project&apos;s original software, design, names, and content belong to their respective student authors or licensors. These Terms grant permission to use the prototype for its educational purpose; they do not grant permission to copy, sell, sublicense, or commercially exploit project materials except where applicable law permits or the rights holder gives permission. 42 Network names and trademarks remain the property of their respective owners.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>7. Disclaimers and limitation of liability</Typography>
            <Typography>
              CardGame is provided for educational demonstration on an &quot;as is&quot; and &quot;as available&quot; basis. The student team does not promise continuous availability, complete accuracy, security, suitability, or preservation of data. To the extent permitted by law, the team and project contributors are not liable for losses, interruptions, unauthorized access, or lost data resulting from use of the prototype. Nothing in these Terms limits liability that cannot lawfully be limited.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>8. Suspension, termination, and changes</Typography>
            <Typography>
              You may stop using CardGame at any time. The student team may suspend access, reset data, or end the deployment for development, evaluation, security, legal, or academic reasons. The project may update these Terms as it evolves; the effective date identifies the current version. Provisions about content, intellectual property, disclaimers, and limitations continue where applicable after use ends.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>9. Contact</Typography>
            <Typography>
              Questions about these Terms should be directed to the student team or the administrator of the deployment you are using. These Terms are project documentation, not legal advice. They should be reviewed by the responsible educational institution before this prototype is made publicly available or used for any commercial purpose.
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}