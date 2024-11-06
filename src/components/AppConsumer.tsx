import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { AppContextProvider, AppContext } from 'context/AppContext';
import { DBServiceClient } from 'utils/DBServiceClient';
import { getSDKServices, models } from '@risefunds/sdk';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseUser } from 'utils/FirebaseAuth';
import { usePathname } from 'next/navigation';

export const AppConsumerComponent: React.FC<{
  Component: any;
  pageProps: any;
}> = ({ Component, ...pageProps }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [platformUser, setPlatformUser] = useState<
    models.PlatformUserEntityModel | undefined
  >();
  const sdkServices = useMemo(() => getSDKServices(), []);
  const platformUserSubscription = useRef<Function | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user ?? null);
      setLoading(false);
    });

    const dbClient = new DBServiceClient();
    sdkServices.base.referenceService.db = dbClient;
    sdkServices.base.backendService.externalApi = process.env.NEXT_PUBLIC_API;

    return () => unsubscribe();
  }, [sdkServices, router]);

  // Render a loading state while Firebase auth state is being determined
  if (loading) {
    return <CircularProgress color="primary" sx={{ margin: '1rem' }} />;
  }

  return (
    <AppContextProvider>
      <ProtectedRoute
        Component={Component}
        pageProps={pageProps}
        pathname={pathname}
      />
    </AppContextProvider>
  );
};

const ProtectedRoute: React.FC<{
  Component: any;
  pageProps: any;
  pathname: string;
}> = ({ Component, pageProps, pathname }) => {
  const { helper } = useContext(AppContext);
  const router = useRouter();

  const isProtectedRoute = pathname.includes('/user/su');
  const { isSU, authUserLoading } = helper;

  useEffect(() => {
    // Wait until authUserLoading is false and isSU is evaluated
    if (!authUserLoading && isProtectedRoute && !isSU) {
      router.push('/'); // Redirect to an unauthorized page
    }
  }, [authUserLoading, isProtectedRoute, isSU, router]);

  // Render loading state if authUserLoading is true
  // if (authUserLoading) {
  //   return <CircularProgress color="primary" sx={{ margin: '1rem' }} />;
  // }

  // Render the component if user is authorized or route is not protected
  return <Component {...pageProps} />;
};

export default AppConsumerComponent;
