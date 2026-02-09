import { getAuth, onAuthStateChanged } from "firebase/auth";

export function waitForAuthReady(): Promise<boolean> {
  const auth = getAuth();

  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(!!user);
    });
  });
}
