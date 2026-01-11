<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-text class="ion-padding">
        โดย ภูมิภัทร รีพิมพ์ รหัส 673380019-3
      </ion-text>

      <ion-grid>
        <ion-row>
          <ion-col
            size="6"
            v-for="(photo, index) in photos"
            :key="photo.filepath || index"
          >
            <ion-img :src="photo.webviewPath" />
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="addNewToGallery">
          <ion-icon :icon="camera" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { camera } from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
} from '@ionic/vue';

import { usePhotoGallery } from '@/composables/usePhotoGallery';

// ✅ ดึงมาแค่นี้พอ
const { photos, addNewToGallery } = usePhotoGallery();
</script>
