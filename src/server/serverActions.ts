// serverActions.js
'use server';

import { revalidatePath } from 'next/cache';

export async function handleFeatureRevalidate() {
  console.log('Revalidating /');
  revalidatePath('/');
}

export async function handleVerifyRevalidate() {
  console.log('Revalidating /user/profile');
  revalidatePath('/user/dashboard/document');
}
