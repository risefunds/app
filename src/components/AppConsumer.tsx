import React, { useState, useEffect, useMemo, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { AppContextProvider } from 'context/AppContext';
import { DBServiceClient } from 'utils/DBServiceClient';
import { getSDKServices, models } from '@risefunds/sdk';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import your Firebase auth utilities
import { FirebaseUser } from 'utils/FirebaseAuth'; // Your custom Firebase user type

export const AppConsumerComponent: React.FC<{
  Component: any;
  pageProps: any;
}> = ({ Component, ...pageProps }) => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [platformUser, setPlatformUser] = useState<
    models.PlatformUserEntityModel | undefined
  >();
  const sdkServices = useMemo(() => getSDKServices(), []);
  const platformUserSubscription = useRef<Function | undefined>();
  const [loading, setLoading] = useState(true); // Loading state to prevent mismatches during SSR

  useEffect(() => {
    const auth = getAuth();

    // Firebase authentication state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
        // router.push('/');
      }
      setLoading(false);
    });

    const dbClient = new DBServiceClient();
    sdkServices.base.referenceService.db = dbClient;
    sdkServices.base.backendService.externalApi = process.env.NEXT_PUBLIC_API;

    return () => unsubscribe(); // Cleanup the auth state change listener on unmount
  }, [sdkServices, router]);

  // Render a loading state while the Firebase auth state is being determined
  if (loading) {
    return <CircularProgress color="primary" sx={{ margin: '1rem' }} />;
  }

  return (
    <AppContextProvider>
      <Component {...pageProps} authUser={authUser} sdkServices={sdkServices} />
    </AppContextProvider>
  );
};

export default AppConsumerComponent;
