import React, {
  createContext,
  useMemo,
  useReducer,
  useState,
  useEffect,
} from 'react';
import { useSnackbar, VariantType, OptionsObject } from 'notistack';
import { models, ISDKServices, getSDKServices } from '@risefunds/sdk';
import {
  signInWithEmailLinkHandler,
  signInWithCustomTokenHandler,
  signOutHandler,
  FirebaseUser,
} from 'utils/FirebaseAuth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
    moreOptions?: OptionsObject
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
  showSnackbar: function (
    message: string,
    variant?: VariantType,
    duration?: number,
    moreOptions?: OptionsObject
  ): void {
    throw new Error('Function not implemented.');
  },
  showError: function (error: unknown, persist?: boolean): void {
    throw new Error('Function not implemented.');
  },
  showSuccess: function (message: string): void {
    throw new Error('Function not implemented.');
  },
  isSU: false,
  isMobile: false,
  height: 0,
  width: 0,
  setPlatformUser: function (
    platformUser: models.PlatformUserEntityModel
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
  signInWithCustomToken: function (customToken: string): Promise<void> {
    throw new Error('Function not implemented.');
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
    undefined
  );
  const { height, width } = getWindowDimensions();
  const { enqueueSnackbar } = useSnackbar();
  const responsiveWidth = useWidth();
  const initialLocalStore =
    typeof window !== 'undefined'
      ? JSON.parse(window.localStorage.getItem('appLocalStore') || '[]')
      : [];
  const [localStore, dispatch] = useReducer(
    LocalStoreReducer,
    initialLocalStore
  );

  // Initialize SDK services here
  const sdkServices = useMemo(() => getSDKServices(), []);

  // Track Firebase auth state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(undefined);
      }
      setAuthUserLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

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
      isMobile: responsiveWidth === 'xs',
      authUserLoading,
      height,
      width,
      firebaseUser, // Add firebaseUser to the helper
      setPlatformUser,
      signOut: signOutHandler, // Use the custom signOutHandler
      signInWithEmailLink: async (link: string) => {
        const email = helper.getLocalStoreValue('signInEmail');
        if (email) {
          await signInWithEmailLinkHandler(email, link); // Use the custom handler
        } else {
          console.error('Email is not stored locally.');
        }
      },
      signInWithCustomToken: signInWithCustomTokenHandler, // Use the custom handler
      setLocalStoreValue: (key: string, value: any) => {
        dispatch({ type: 'SET', data: { key, value } });
        window.localStorage.setItem(
          'appLocalStore',
          JSON.stringify(localStore)
        );
      },
      deleteLocalStoreValue: (key: string) => {
        dispatch({ type: 'DELETE', data: { key } });
        window.localStorage.setItem(
          'appLocalStore',
          JSON.stringify(localStore)
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
  ]);

  return (
    <AppContext.Provider value={{ helper, sdkServices }}>
      {children}
    </AppContext.Provider>
  );
};
