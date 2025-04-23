import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isVariableValid(variable: any) {
  return variable !== null && variable !== undefined;
}

export function validateBoolean(variable: any, value: any) {
  if (isVariableValid(variable) && variable === value) {
    return true;
  }

  return false;
}

export function isUserAdminClientSide(session: any): boolean {
  const userEmail = session.user.email;
  return userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
}
