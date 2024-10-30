// hooks/useAuth.ts
'use client';

import { useEffect, useState, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { auth } from 'utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<null | { email: string }>(null);
  const appContext = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email! });
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user, appContext };
};
