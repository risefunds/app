import React, { createContext, useMemo, useReducer, useState } from 'react';
import { useSnackbar, VariantType, OptionsObject } from 'notistack';
import { models, ISDKServices, getSDKServices } from '@risefunds/sdk';
import {
  signInWithEmailLinkHandler,
  signInWithCustomTokenHandler,
  signOutHandler,
  FirebaseUser,
} from 'utils/FirebaseAuth';
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
  const { enqueueSnackbar } = useSnackbar();
  const responsiveWidth = useWidth();

  // Initialize SDK services here
  const sdkServices = useMemo(() => getSDKServices(), []);

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
    };
  }, [enqueueSnackbar, responsiveWidth]);

  return (
    <AppContext.Provider value={{ helper, sdkServices }}>
      {children}
    </AppContext.Provider>
  );
};
