<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>แก้ไขรายการ</ion-title>
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
        type="number"
        label-placement="floating"
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

      <ion-button expand="block" @click="updateExpense">
        บันทึกการแก้ไข
      </ion-button>

      <ion-button expand="block" color="danger" @click="confirmDelete">
        ลบรายการ
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
  IonButton,
  alertController
} from "@ionic/vue";

import { ref, onMounted } from "vue";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;

const title = ref("");
const amount = ref<number | null>(null);
const type = ref("expense");
const category = ref("");
const note = ref("");

onMounted(async () => {
  const snap = await getDoc(doc(db, "expenses", id));
  if (snap.exists()) {
    const data = snap.data();
    title.value = data.title;
    amount.value = data.amount;
    type.value = data.type;
    category.value = data.category;
    note.value = data.note;
  }
});

const updateExpense = async () => {
  await updateDoc(doc(db, "expenses", id), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value
  });

  router.push("/tabs/tab1");
};

const confirmDelete = async () => {
  const alert = await alertController.create({
    header: "ยืนยันการลบ",
    message: "คุณต้องการลบรายการนี้ใช่หรือไม่?",
    buttons: [
      {
        text: "ยกเลิก",
        role: "cancel"
      },
      {
        text: "ลบ",
        role: "destructive",
        handler: async () => {
          await deleteDoc(doc(db, "expenses", id));
          router.push("/tabs/tab1");
        }
      }
    ]
  });

  await alert.present();
};
</script>
