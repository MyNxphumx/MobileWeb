// auth-service.ts

import { Capacitor } from "@capacitor/core";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

import type {
  IAuthService,
  EmailPasswordCredentials,
  PhoneCredentials,
} from "./auth-interface";

import { FirebaseWebAuthService } from "./auth-web";
import { FirebaseAppAuthService } from "./auth-app";

// ============================================================================
// เลือก implementation ตาม platform
// ============================================================================
const impl: IAuthService = Capacitor.isNativePlatform()
  ? new FirebaseAppAuthService()
  : new FirebaseWebAuthService();

// ============================================================================
// Facade Service (ตัวเดียวที่ UI / Router ใช้)
// ============================================================================
class AuthService implements IAuthService {

  // 🔐 รอ Firebase auth พร้อม (ใช้กับ router guard)
  waitForAuthReady(): Promise<User | null> {
    const auth = getAuth();
    return new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        unsub();
        resolve(user);
      });
    });
  }

  // ================= Current User =================
  getCurrentUser() {
    return impl.getCurrentUser();
  }

  // ================= Email / Password =================
  loginWithEmailPassword(creds: EmailPasswordCredentials) {
    return impl.loginWithEmailPassword(creds);
  }

  registerWithEmailPassword(creds: EmailPasswordCredentials) {
    return impl.registerWithEmailPassword(creds);
  }

  // ================= Google =================
  loginWithGoogle() {
    return impl.loginWithGoogle();
  }

  // ================= Phone =================
  startPhoneLogin(creds: PhoneCredentials) {
    return impl.startPhoneLogin(creds);
  }

  confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }) {
    return impl.confirmPhoneCode(payload);
  }

  // ================= Logout =================
  logout() {
    return impl.logout();
  }
}

// export ตัวเดียวใช้ทั้งแอป
export const authService = new AuthService();
