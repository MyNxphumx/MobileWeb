<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- ปุ่มเพิ่มรายการ -->
      <ion-button expand="block" router-link="/tabs/add">
        + เพิ่มรายการ
      </ion-button>

      <!-- สรุปยอด -->
      <ion-card>
        <ion-card-content>
          <p>💰 รายรับรวม: {{ totalIncome }} บาท</p>
          <p>💸 รายจ่ายรวม: {{ totalExpense }} บาท</p>
        </ion-card-content>
      </ion-card>

      <!-- แสดงรายการ -->
      <ion-list>
        <ion-item
          v-for="item in expenses"
          :key="item.id"
          button
          @click="goToEdit(item.id)"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.category }} | {{ item.note }}</p>
          </ion-label>

          <ion-badge
            :color="item.type === 'income' ? 'success' : 'danger'">
            {{ item.type === 'income' ? '+' : '-' }}
            {{ item.amount }} บาท
          </ion-badge>
        </ion-item>
      </ion-list>

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
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonCard,
  IonCardContent
} from "@ionic/vue";

import { ref, computed, onMounted } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  note: string;
}

const expenses = ref<Expense[]>([]);

onMounted(() => {
  const q = collection(db, "expenses");

  onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Expense, "id">),
    }));
  });
});

const totalIncome = computed(() =>
  expenses.value
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0)
);

const totalExpense = computed(() =>
  expenses.value
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0)
);

const goToEdit = (id: string) => {
  router.push(`/tabs/edit/${id}`);
};
</script>
