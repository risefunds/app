import React, {
  createContext,
  useMemo,
  useReducer,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useSnackbar, VariantType, OptionsObject } from 'notistack';
import { models, ISDKServices, getSDKServices } from '@risefunds/sdk';
import {
  signInWithEmailLinkHandler,
  signInWithCustomTokenHandler,
  signOutHandler,
  FirebaseUser,
} from 'utils/FirebaseAuth';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from 'utils/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import {
  useWidth,
  getWindowDimensions,
  LocalStoreReducer,
} from 'utils/helpers';

export interface IAppContextHelper {
  showSnackbar(
    message: string,
    variant?: VariantType,
    duration?: number,
    moreOptions?: OptionsObject,
  ): void;
  showError(error: unknown, persist?: boolean): void;
  showSuccess(message: string): void;
  isSU: boolean;
  isMobile: boolean;
  firebaseUser?: FirebaseUser;
  height: number;
  width: number;
  platformUser?: models.PlatformUserEntityModel;
  setPlatformUser: (platformUser: models.PlatformUserEntityModel) => void;
  authUserLoading: boolean;
  signOut: () => Promise<void>;
  signInWithEmailLink: (link: string) => Promise<void>;
  signInWithCustomToken: (customToken: string) => Promise<void>;
  setLocalStoreValue: (key: string, value: any) => void;
  deleteLocalStoreValue: (key: string) => void;
  getLocalStoreValue: (key: string) => any | undefined;
}

const defaultHelper: IAppContextHelper = {
  showSnackbar(message, variant, duration, moreOptions = {}) {
    console.log(message);
  },
  showError(message, persist = false) {
    console.log(message);
  },
  showSuccess(message) {
    console.log(message);
  },
  isSU: false,
  isMobile: false,
  height: 0,
  width: 0,
  setPlatformUser: function (
    platformUser: models.PlatformUserEntityModel,
  ): void {
    throw new Error('Function not implemented.');
  },
  authUserLoading: false,
  signOut: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  signInWithEmailLink: function (link: string): Promise<void> {
    throw new Error('Function not implemented.');
  },
  signInWithCustomToken: async function (customToken: string): Promise<void> {
    try {
      await signInWithCustomToken(auth, customToken);
      console.log('Signed in with custom token successfully.');
    } catch (error) {
      console.error('Error signing in with custom token:', error);
      this.showError('Failed to sign in with the provided token.');
    }
  },
  setLocalStoreValue: function (key: string, value: any): void {
    throw new Error('Function not implemented.');
  },
  deleteLocalStoreValue: function (key: string): void {
    throw new Error('Function not implemented.');
  },
  getLocalStoreValue: function (key: string) {
    throw new Error('Function not implemented.');
  },
};

export const AppContext = createContext<{
  helper: IAppContextHelper;
  sdkServices?: ISDKServices;
}>({
  helper: defaultHelper,
  sdkServices: undefined,
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [platformUser, setPlatformUser] = useState<
    models.PlatformUserEntityModel | undefined
  >();
  const [authUserLoading, setAuthUserLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | undefined>(
    undefined,
  );
  const { height, width } = getWindowDimensions();
  const { enqueueSnackbar } = useSnackbar();
  const responsiveWidth = useWidth();
  const router = useRouter();
  const pathname = usePathname();
  const initialLocalStore =
    typeof window !== 'undefined'
      ? JSON.parse(window.localStorage.getItem('appLocalStore') || '[]')
      : [];
  const [localStore, dispatch] = useReducer(
    LocalStoreReducer,
    initialLocalStore,
  );

  const sdkServices = useMemo(() => getSDKServices(), []);
  const platformUserSubscription = useRef<Function | undefined>();

  // Define isSU based on firebaseUser's email
  const isSU = useMemo(() => {
    const superUserEmails = ['ben@gmail.com', 'benedictuyioghosa@gmail.com'];
    return firebaseUser?.email
      ? superUserEmails.includes(firebaseUser.email)
      : false;
  }, [firebaseUser]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setAuthUserLoading(true);

        sdkServices.base.backendService.getAuthorization = async () => {
          const jwt = await user.getIdToken();
          return { uid: user.uid, jwt };
        };

        platformUserSubscription.current =
          await sdkServices.core.PlatformUserEntityService.subscribeDocument(
            { id: user.uid },
            async (error, dataPromise) => {
              try {
                if (error) throw error;
                const platformUser = await dataPromise;
                setPlatformUser(platformUser);
              } catch (error) {
                console.error('Error fetching platform user:', error);
                helper.showError((error as Error).message);
                setPlatformUser(undefined);
              } finally {
                setAuthUserLoading(false);
              }
            },
          );
      } else {
        setFirebaseUser(undefined);
        setPlatformUser(undefined);
        sdkServices.base.backendService.getAuthorization = undefined;
        setAuthUserLoading(false);
      }
    });

    return () => {
      if (platformUserSubscription.current) platformUserSubscription.current();
      unsubscribe();
    };
  }, [sdkServices]);

  const helper: IAppContextHelper = useMemo(() => {
    return {
      ...defaultHelper,
      showSnackbar: (message, variant, duration, moreOptions = {}) => {
        enqueueSnackbar(message, {
          variant,
          autoHideDuration: duration,
          ...moreOptions,
        });
      },
      showError: (error: unknown, persist = false) => {
        enqueueSnackbar((error as Error).message, {
          persist,
          variant: 'error',
        });
      },
      showSuccess: (message) => {
        enqueueSnackbar(message, { variant: 'success' });
      },
      isSU,
      isMobile: responsiveWidth === 'xs',
      authUserLoading,
      height,
      width,
      firebaseUser,
      platformUser,
      setPlatformUser,
      signOut: signOutHandler,
      signInWithEmailLink: async (link: string) => {
        const email = helper.getLocalStoreValue('signInEmail');
        if (email) {
          await signInWithEmailLinkHandler(email, link);
        } else {
          console.error('Email is not stored locally.');
        }
      },
      signInWithCustomToken: signInWithCustomTokenHandler,
      setLocalStoreValue: (key: string, value: any) => {
        dispatch({ type: 'SET', data: { key, value } });
        window.localStorage.setItem(
          'appLocalStore',
          JSON.stringify(localStore),
        );
      },
      deleteLocalStoreValue: (key: string) => {
        dispatch({ type: 'DELETE', data: { key } });
        window.localStorage.setItem(
          'appLocalStore',
          JSON.stringify(localStore),
        );
      },
      getLocalStoreValue: (key: string) => {
        const storedValue = localStore.find((item) => item.key === key);
        return storedValue ? storedValue.value : undefined;
      },
    };
  }, [
    enqueueSnackbar,
    responsiveWidth,
    authUserLoading,
    firebaseUser,
    localStore,
    platformUser,
    isSU,
  ]);

  return (
    <AppContext.Provider value={{ helper, sdkServices }}>
      {children}
    </AppContext.Provider>
  );
};
