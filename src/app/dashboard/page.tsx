'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from 'hooks/useAuth';

export default function Dashboard() {
  const { user, appContext } = useAuth();

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
