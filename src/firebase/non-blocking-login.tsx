'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FirebaseError,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

// A map of Firebase error codes to user-friendly messages.
const FIREBASE_AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'The email or password you entered is incorrect. Please try again.',
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'The password you entered is incorrect.',
  'auth/email-already-in-use': 'An account with this email address already exists.',
  'auth/weak-password': 'The password is too weak. Please choose a stronger password.',
};

/**
 * Handles Firebase authentication errors by displaying a toast notification.
 * @param {any} error - The error object caught from a Firebase call.
 */
function handleAuthError(error: any) {
  const firebaseError = error as FirebaseError;
  const errorCode = firebaseError.code || 'auth/unknown-error';

  const message =
    FIREBASE_AUTH_ERROR_MESSAGES[errorCode] ||
    'An unexpected error occurred. Please try again.';

  toast({
    variant: 'destructive',
    title: 'Authentication Failed',
    description: message,
  });
}

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch(handleAuthError);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch(handleAuthError);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password).catch(handleAuthError);
}
