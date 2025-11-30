'use server';
/**
 * @fileoverview A flow for checking if a user has admin privileges.
 * This flow uses the Firebase Admin SDK to securely check for the existence
 * of a document in the `roles_admin` collection, which is protected
 * by security rules from client-side access.
 *
 * - isAdmin - A function that takes a user UID and returns a boolean.
 */

import {z} from 'genkit';
import {ai} from '@/ai/genkit';
import * as admin from 'firebase-admin';

// Initialize the Admin SDK if it hasn't been already.
// This is safe to run multiple times.
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Define the input schema for the flow
const IsAdminInputSchema = z.string().describe('The UID of the user to check.');

// Define the output schema for the flow
const IsAdminOutputSchema = z.boolean().describe('True if the user is an admin, false otherwise.');


/**
 * A Genkit flow that securely checks if a user is an administrator.
 * @param {string} uid The user's unique identifier.
 * @returns {Promise<boolean>} A promise that resolves to true if the user is an admin, and false otherwise.
 */
const isAdminFlow = ai.defineFlow(
  {
    name: 'isAdminFlow',
    inputSchema: IsAdminInputSchema,
    outputSchema: IsAdminOutputSchema,
  },
  async (uid) => {
    if (!uid) {
        return false;
    }
    try {
      const adminRoleDoc = await db.collection('roles_admin').doc(uid).get();
      return adminRoleDoc.exists;
    } catch (error) {
      console.error("Error checking admin status:", error);
      // In case of an error, default to false for security.
      return false;
    }
  }
);


/**
 * Exported wrapper function to be called from the client-side.
 * This makes the flow easily consumable by React components.
 * @param {string} uid The user's unique identifier.
 * @returns {Promise<boolean>} A promise that resolves to true if the user is an admin.
 */
export async function isAdmin(uid: string): Promise<boolean> {
  return isAdminFlow(uid);
}
