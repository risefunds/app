import { OptionsObject, VariantType } from 'notistack';
import { models } from '@risefunds/sdk';
import { FirebaseUser } from 'utils/FirebaseAuth';

// Helper interface
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

// Default helper
export const defaultHelper: IAppContextHelper = {
  isMobile: false,
  isSU: false,
  showSnackbar: (message, variant, duration, moreOptions = {}) =>
    console.log(message),
  showError: (error, persist = false) => console.log(error),
  showSuccess: (message) => console.log(message),
  height: 0,
  width: 0,
  authUserLoading: true,
  signOut: async () => {},
  setPlatformUser: (puser) => {},
  signInWithEmailLink: async (link: string) => {},
  signInWithCustomToken: async (customToken: string) => {},
  getLocalStoreValue: (key) => undefined,
  deleteLocalStoreValue: (key) => {},
  setLocalStoreValue: (key, value) => {},
};

// Local storage reducer for the local storage management
export const LocalStoreReducer = (
  local: Array<{ key: string; value: string }>,
  action: { type: 'SET' | 'DELETE'; data: { key: string; value?: any } },
) => {
  switch (action.type) {
    case 'SET': {
      let updated = [...local];
      if (updated.some((k) => k.key === action.data.key)) {
        updated = updated.map((u) => {
          if (u.key === action.data.key) {
            return { ...u, value: action.data.value ?? null };
          }
          return u;
        });
      } else {
        updated = [
          ...updated,
          { key: action.data.key, value: action.data.value ?? null },
        ];
      }
      localStorage.setItem('risefunds.app', JSON.stringify(updated));
      return updated;
    }
    case 'DELETE': {
      const updated = local.filter((l) => l.key !== action.data.key);
      localStorage.setItem('risefunds.app', JSON.stringify(updated));
      return updated;
    }
    default:
      return local;
  }
};
