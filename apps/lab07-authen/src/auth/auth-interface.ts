// auth-interface.ts

export interface AuthUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}

export interface EmailPasswordCredentials {
  email: string;
  password: string;
}

export interface PhoneCredentials {
  phoneNumberE164: string; // เช่น +66812345678
}

export type AuthProvider = "email" | "phone" | "google";

export interface IAuthService {
  // ===== Common =====
  getCurrentUser(): Promise<AuthUser | null>;
  logout(): Promise<void>;

  // ===== Email / Password =====
  loginWithEmailPassword(
    creds: EmailPasswordCredentials
  ): Promise<AuthUser>;

  /** ✅ เพิ่มอันนี้ */
  registerWithEmailPassword(
    creds: EmailPasswordCredentials
  ): Promise<AuthUser>;

  // ===== Google =====
  loginWithGoogle(): Promise<AuthUser>;

  // ===== Phone =====
  startPhoneLogin(
    creds: PhoneCredentials
  ): Promise<{ verificationId: string }>;

  confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }): Promise<AuthUser>;
}
