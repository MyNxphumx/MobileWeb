<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>

        <ion-buttons slot="end">
          <ion-button color="danger" @click="logout">
            Logout
          </ion-button>
        </ion-buttons>

      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-card v-if="user">
        <ion-card-header>
          <ion-card-title>User Info</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <p><b>UID:</b> {{ user.uid }}</p>
          <p><b>Email:</b> {{ user.email ?? "-" }}</p>
          <p><b>Phone:</b> {{ user.phoneNumber ?? "-" }}</p>
          <p><b>Name:</b> {{ user.displayName ?? "-" }}</p>

          <ion-img
            v-if="user.photoUrl"
            :src="user.photoUrl"
            style="max-width: 120px; margin-top: 10px"
          />
        </ion-card-content>
      </ion-card>

      <ion-text v-else>
        Loading user...
      </ion-text>

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
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonText,
} from "@ionic/vue";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/auth/auth-service";
import type { AuthUser } from "@/auth/auth-interface";

const router = useRouter();
const user = ref<AuthUser | null>(null);

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

async function logout() {
  await authService.logout();
  router.replace("/login");
}
</script>
