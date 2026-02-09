<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-input
        label="ชื่อรายการ"
        label-placement="floating"
        v-model="title">
      </ion-input>

      <ion-input
        label="จำนวนเงิน"
        label-placement="floating"
        type="number"
        v-model="amount">
      </ion-input>

      <ion-select
        label="ประเภท"
        label-placement="floating"
        v-model="type">
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>

      <ion-input
        label="หมวดหมู่"
        label-placement="floating"
        v-model="category">
      </ion-input>

      <ion-textarea
        label="หมายเหตุ"
        label-placement="floating"
        v-model="note">
      </ion-textarea>

      <ion-button expand="block" @click="saveExpense">
        บันทึกข้อมูล
      </ion-button>

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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton
} from "@ionic/vue";

import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

const title = ref("");
const amount = ref<number | null>(null);
const type = ref("expense");
const category = ref("");
const note = ref("");

const saveExpense = async () => {
  if (!title.value || amount.value === null) {
    alert("กรุณากรอกชื่อรายการและจำนวนเงิน");
    return;
  }

  await addDoc(collection(db, "expenses"), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value,
    createdAt: new Date()
  });

  router.push("/tabs/list");
};
</script>
