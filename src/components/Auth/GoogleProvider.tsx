import { useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from 'utils/firebaseConfig';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const GoogleProvider = () => {
  const appContext = useContext(AppContext);
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    try {
      // Perform Google sign-in
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Send the ID token to the backend
      const signupResponse =
        await appContext.sdkServices?.base.backendService.request<{
          customToken: string;
        }>(
          '/pub/addon/entity/PlatformUser/signupWithGoogle',
          { idToken },
          false,
        );

      if (!signupResponse) throw new Error('Signup failed. Please try again.');

      // Sign in with the custom token received from the backend
      await appContext.helper.signInWithCustomToken(signupResponse.customToken);

      appContext.helper.showSuccess('Sign up Success');
      router.push('/');
    } catch (error: any) {
      console.error(error.message);
      appContext.helper.showError(error);
    }
  };
  return (
    <Box sx={{ mb: 2 }}>
      <Button
        fullWidth
        size="small"
        variant="outlined"
        sx={{
          textTransform: 'none',
          padding: '0.5rem',
          borderRadius: '5px',
        }}
        onClick={handleGoogleSignIn}
      >
        SIGN IN WITH GOOGLE
      </Button>
    </Box>
  );
};

export default GoogleProvider;
