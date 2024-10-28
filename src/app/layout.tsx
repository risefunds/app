'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from 'utils/theme';
import AppConsumerComponent from '../components/AppConsumer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <CssBaseline />
              {/* Wrap the entire layout with AppConsumerComponent */}
              <AppConsumerComponent
                Component={() => <>{children}</>}
                pageProps={{}}
              />
            </SnackbarProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
