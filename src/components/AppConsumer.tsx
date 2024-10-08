import React, { useState, useEffect, useMemo, useRef } from 'react';
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

  useEffect(() => {
    const auth = getAuth();

    // Firebase authentication state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
        router.push('/auth/login'); // Redirect to login if not authenticated
      }
    });

    const dbClient = new DBServiceClient();
    if (process.env.NEXT_PUBLIC_ENV === 'local') {
      dbClient.connectToEmulator();
    }
    sdkServices.base.referenceService.db = dbClient;
    sdkServices.base.backendService.externalApi = process.env.NEXT_PUBLIC_API;

    const subscribePlatformUser = async () => {
      if (authUser?.uid) {
        if (!platformUserSubscription.current || !platformUser) {
          sdkServices.base.backendService.getAuthorization = async () => {
            const jwt = await authUser.getIdToken();
            const uid = authUser.uid;
            return { uid, jwt };
          };

          platformUserSubscription.current =
            await sdkServices.core.PlatformUserEntityService.subscribeDocument(
              { id: authUser.uid },
              async (error, dataPromise) => {
                if (error) {
                  console.error('Error fetching platform user:', error);
                  return;
                }
                const platformUser = await dataPromise;
                setPlatformUser(platformUser);
              }
            );
        }
      }
    };

    subscribePlatformUser();

    return () => unsubscribe(); // Cleanup the auth state change listener on unmount
  }, [authUser, sdkServices, platformUser, router]);

  return (
    <AppContextProvider>
      <Component
        {...pageProps}
        authUser={authUser}
        platformUser={platformUser}
        sdkServices={sdkServices}
      />
    </AppContextProvider>
  );
};

export default AppConsumerComponent;
