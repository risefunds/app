import {
  getAuth,
  signInWithEmailLink,
  signInWithCustomToken,
  signOut,
  User,
} from 'firebase/auth';

export type FirebaseUser = User;

export const signInWithEmailLinkHandler = async (
  email: string,
  link: string,
) => {
  const auth = getAuth();
  try {
    await signInWithEmailLink(auth, email, link);
  } catch (error) {
    console.error('Error during email link sign-in:', error);
  }
};

export const signInWithCustomTokenHandler = async (customToken: string) => {
  const auth = getAuth();
  try {
    await signInWithCustomToken(auth, customToken);
  } catch (error) {
    console.error('Error during custom token sign-in:', error);
    // appContext.helper.showError(error);
  }
};

export const signOutHandler = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};
