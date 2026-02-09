import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
} from "firebase/auth";

import type {
  AuthUser,
  IAuthService,
  EmailPasswordCredentials,
  PhoneCredentials,
} from "./auth-interface";

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyDIC1Q6ZVpXLkNc7tFj_c8xOgziB_nJx2g",
  authDomain: "lab06-expense-4cff6.firebaseapp.com",
  projectId: "lab06-expense-4cff6",
  storageBucket: "lab06-expense-4cff6.appspot.com",
  messagingSenderId: "714844899922",
  appId: "1:714844899922:web:de79dfd7c33ee06b666d8b",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

// ===== map user =====
function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? null,
    phoneNumber: u.phoneNumber ?? null,
    displayName: u.displayName ?? null,
    photoUrl: u.photoURL ?? null,
  };
}

// ===== Phone (Web) =====
const recaptchaContainerId = "recaptcha-container";
let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

function getRecaptchaVerifier(): RecaptchaVerifier {
  if (!verifier) {
    verifier = new RecaptchaVerifier(firebaseAuth, recaptchaContainerId, {
      size: "invisible",
    });
  }
  return verifier;
}

// ================= Auth Service =================
export class FirebaseWebAuthService implements IAuthService {

  async getCurrentUser(): Promise<AuthUser | null> {
    return firebaseAuth.currentUser
      ? mapUser(firebaseAuth.currentUser)
      : null;
  }

  // ===== LOGIN =====
  async loginWithEmailPassword(
    creds: EmailPasswordCredentials
  ): Promise<AuthUser> {
    const r = await signInWithEmailAndPassword(
      firebaseAuth,
      creds.email,
      creds.password
    );
    return mapUser(r.user);
  }

  // ===== REGISTER =====
  async registerWithEmailPassword(
    creds: EmailPasswordCredentials
  ): Promise<AuthUser> {
    const r = await createUserWithEmailAndPassword(
      firebaseAuth,
      creds.email,
      creds.password
    );
    return mapUser(r.user);
  }

  // ===== GOOGLE =====
  async loginWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }

  // ===== PHONE =====
  async startPhoneLogin(
    creds: PhoneCredentials
  ): Promise<{ verificationId: string }> {
    const verifier = getRecaptchaVerifier();
    confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      creds.phoneNumberE164,
      verifier
    );
    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }): Promise<AuthUser> {
    if (!confirmationResult) {
      throw new Error("No confirmation result");
    }
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
  }
}
