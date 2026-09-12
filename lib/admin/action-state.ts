/**
 * Shape returned by admin forms via `useActionState`.
 *
 * Kept out of the `"use server"` modules because those may only export async
 * functions.
 */
export type ActionState = {
  error?: string;
  ok?: boolean;
} | null;

export const INITIAL_ACTION_STATE: ActionState = null;
