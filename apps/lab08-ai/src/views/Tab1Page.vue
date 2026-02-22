<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lab08: Gemini Vision โดย Phumipat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- เลือกไฟล์ -->
      <input
        ref="fileEl"
        type="file"
        accept="image/*"
        hidden
        @change="onFileChange"
      />

      <ion-button expand="block" @click="fileEl?.click()">
        เลือกไฟล์ภาพ
      </ion-button>

      <ion-button expand="block" @click="onTakePhoto">
        ถ่ายภาพ (Camera)
      </ion-button>

      <!-- preview -->
      <ion-img v-if="previewUrl" :src="previewUrl" />

      <ion-button
        expand="block"
        :disabled="!img || loading"
        @click="onAnalyze"
      >
        วิเคราะห์ภาพ
      </ion-button>

      <ion-spinner v-if="loading" />

      <!-- ผลลัพธ์ -->
      <ion-card v-if="result">
        <ion-card-header>
          <ion-card-title>ผลการวิเคราะห์ภาพ</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <!-- caption -->
          <p><strong>คำอธิบายภาพ</strong></p>
          <p>{{ result.caption }}</p>

          <!-- tags -->
          <p><strong>แท็กที่เกี่ยวข้อง</strong></p>
          <ion-list>
            <ion-item v-for="(tag, i) in result.tags" :key="i">
              {{ tag }}
            </ion-item>
          </ion-list>

          <!-- objects -->
          <div v-if="result.objects?.length">
            <p><strong>วัตถุที่ตรวจพบ</strong></p>
            <ion-list>
              <ion-item
                v-for="(obj, i) in result.objects"
                :key="i"
              >
                {{ obj.name }}
                <span v-if="obj.confidence">
                  ({{ (obj.confidence * 100).toFixed(1) }}%)
                </span>
              </ion-item>
            </ion-list>
          </div>

          <!-- safety -->
          <div v-if="result.safety">
            <p><strong>การตรวจสอบความปลอดภัย</strong></p>
            <p>
              ภาพนี้
              <strong>
                {{ result.safety.isSensitive ? "มีความอ่อนไหว" : "ไม่มีความอ่อนไหว" }}
              </strong>
            </p>
            <p v-if="result.safety.notes">
              หมายเหตุ: {{ result.safety.notes }}
            </p>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem
} from "@ionic/vue";

import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image, ImageAnalysisResult } from "../core/ai.interface";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref<string>("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref<boolean>(false);

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}

async function onTakePhoto() {
  loading.value = true;
  try {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } finally {
    loading.value = false;
  }
}

async function onAnalyze() {
  if (!img.value) return;

  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } finally {
    loading.value = false;
  }
}
</script>