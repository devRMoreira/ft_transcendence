import AppThemeProvider from "./theme-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth";
import { Box, Container, Link, Stack, Typography } from "@mui/material";

export const metadata = {
  title: "CardGame",
  description: "CardGame Description",
};

export default async function RootLayout({ children }) {

  const session = await auth()

  return (
    <html lang="en" >
      <body>
        <SessionProvider session={session}>
          <AppRouterCacheProvider>
            <AppThemeProvider>
              <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Box component="main" sx={{ flex: 1 }}>
                  {children}
                </Box>
                <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 3 }}>
                  <Container maxWidth="lg">
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignitems={{ xs: "flex-start", sm: "center" }}
                      justifycontent="space-between"
                    >
                      <Typography variant="body2" color="text.secondary">
                        CardGame
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Link href="/privacy" color="text.secondary" variant="body2">
                          Privacy Policy
                        </Link>
                        <Link href="/terms" color="text.secondary" variant="body2">
                          Terms of Service
                        </Link>
                      </Stack>
                    </Stack>
                  </Container>
                </Box>
              </Box>
            </AppThemeProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
