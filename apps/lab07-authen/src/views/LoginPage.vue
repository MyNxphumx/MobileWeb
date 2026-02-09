<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- ===== Email / Password ===== -->
      <ion-item>
        <ion-input
          v-model="email"
          label="Email"
          type="email"
        />
      </ion-item>

      <ion-item>
        <ion-input
          v-model="password"
          label="Password"
          type="password"
        />
      </ion-item>

      <ion-button expand="block" @click="loginEmail">
        Login Email / Password
      </ion-button>

      <!-- ===== Register ===== -->
      <ion-button
        expand="block"
        color="medium"
        @click="register"
      >
        Register
      </ion-button>

      <ion-item-divider lines="none" />

      <!-- ===== Google ===== -->
      <ion-button
        expand="block"
        color="danger"
        @click="loginGoogle"
      >
        Login with Google
      </ion-button>

      <ion-item-divider lines="none" />

      <!-- ===== Phone ===== -->
      <ion-item>
        <ion-input
          v-model="phone"
          label="Phone (+66...)"
          placeholder="+66812345678"
        />
      </ion-item>

      <ion-button expand="block" @click="startPhoneLogin">
        Send OTP
      </ion-button>

      <ion-item v-if="verificationId">
        <ion-input
          v-model="otp"
          label="OTP Code"
        />
      </ion-item>

      <ion-button
        v-if="verificationId"
        expand="block"
        color="success"
        @click="confirmOtp"
      >
        Confirm OTP
      </ion-button>

      <!-- reCAPTCHA (Web only) -->
      <div id="recaptcha-container"></div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonItemDivider,
  IonInput,
  IonButton,
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/auth/auth-service";

const router = useRouter();

const email = ref("");
const password = ref("");

const phone = ref("");
const otp = ref("");
const verificationId = ref<string | null>(null);

// ===== Email Login =====
async function loginEmail() {
  try {
    await authService.loginWithEmailPassword({
      email: email.value,
      password: password.value,
    });
    router.push("/tabs/tab1");
  } catch (e: any) {
    alert(e.message);
  }
}

// ===== Register =====
async function register() {
  try {
    await authService.registerWithEmailPassword({
      email: email.value,
      password: password.value,
    });
    router.push("/tabs/tab1");
  } catch (e: any) {
    alert(e.message);
  }
}

// ===== Google Login =====
async function loginGoogle() {
  try {
    await authService.loginWithGoogle();
    router.push("/tabs/tab1");
  } catch (e: any) {
    alert(e.message);
  }
}

// ===== Phone Login =====
async function startPhoneLogin() {
  try {
    const r = await authService.startPhoneLogin({
      phoneNumberE164: phone.value,
    });
    verificationId.value = r.verificationId;
    alert("OTP sent");
  } catch (e: any) {
    alert(e.message);
  }
}

async function confirmOtp() {
  try {
    if (!verificationId.value) return;
    await authService.confirmPhoneCode({
      verificationId: verificationId.value,
      verificationCode: otp.value,
    });
    router.push("/tabs/tab1");
  } catch (e: any) {
    alert(e.message);
  }
}
</script>
