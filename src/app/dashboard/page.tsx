'use client';

import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { auth } from 'utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<null | { email: string }>(null);
  const appContext = useContext(AppContext);
  const router = useRouter();

  console.log({ appContext });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email! });
      } else {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>This is a protected dashboard page</p>
    </div>
  );
}
