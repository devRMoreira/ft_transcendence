import { Box, Container, Link, Stack, Typography } from "@mui/material";

export const metadata = {
  title: "Terms of Service | CardGame",
  description: "The rules for using CardGame.",
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
            Terms of Service
          </Typography>
          <Typography color="text.secondary">Effective date: September 20, 2026</Typography>
        </Box>

        <Stack spacing={3}>
          <Box>
            <Typography component="h2" variant="h5" gutterBottom>1. Agreement</Typography>
            <Typography>
              These Terms govern your access to and use of CardGame, including accounts, matches, groups, posts, friends, and direct messages. By creating an account or using the service, you agree to these Terms. If you do not agree, do not use CardGame.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>2. Accounts</Typography>
            <Typography>
              You must provide accurate information, keep your credentials confidential, and be responsible for activity performed through your account. You may not impersonate another person, create an account through automated means, or use an account after we have suspended or terminated it. Notify the project maintainers if you suspect unauthorized access.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>3. Acceptable use</Typography>
            <Typography>
              You may use CardGame for lawful personal and recreational purposes. You must not harass, threaten, defame, or target other users; publish illegal, hateful, sexually explicit, or harmful material; send spam or malicious code; exploit bugs; interfere with matches or the service; attempt unauthorized access; scrape or collect user information; or use the service to violate another person&apos;s rights or applicable law.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>4. User content and moderation</Typography>
            <Typography>
              You retain ownership of content you submit. You grant CardGame the limited, non-exclusive permission to host, store, display, and transmit that content only as needed to provide the features you use. You are responsible for your content and represent that you have the rights needed to submit it. We may remove content or restrict accounts that breach these Terms, create risk, or disrupt the community. We are not required to monitor every message or post.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>5. Game rules and service availability</Typography>
            <Typography>
              Match outcomes and game features may change as CardGame is developed. We may modify, suspend, or discontinue features, including saved match state, without guaranteeing uninterrupted availability. Do not rely on CardGame as a storage service for important information.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>6. Intellectual property</Typography>
            <Typography>
              CardGame and its original software, design, names, and content are owned by the project operators or their licensors. These Terms give you permission to use the service, not to copy, sell, sublicense, reverse engineer, or commercially exploit it except where applicable law permits or we give written permission.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>7. Disclaimers and limitation of liability</Typography>
            <Typography>
              CardGame is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the extent permitted by law, the project operators disclaim warranties of availability, accuracy, fitness for a particular purpose, and non-infringement. We are not liable for indirect, incidental, special, consequential, or lost-data damages arising from use of the service. Nothing in these Terms limits liability that cannot lawfully be limited.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>8. Suspension, termination, and changes</Typography>
            <Typography>
              You may stop using CardGame at any time. We may suspend or terminate access for violations, security concerns, legal requirements, or operational reasons. Sections that by their nature should survive termination, including ownership, user responsibility, disclaimers, and limitations of liability, will continue to apply. We may update these Terms; continued use after the effective date means you accept the updated version.
            </Typography>
          </Box>

          <Box>
            <Typography component="h2" variant="h5" gutterBottom>9. Contact</Typography>
            <Typography>
              Questions about these Terms should be directed to the CardGame project maintainers through the official project repository or the administrator of your deployment. These Terms are governed by the laws applicable to the project operator, without changing any mandatory consumer protections that apply where you live.
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}