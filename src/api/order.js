import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function listOrders(userUid) {
  const q = query(
    collection(db, "orders"),
    where("user_uid", "==", userUid),
    orderBy("created_at", "desc"),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function createOrder(data) {
  const now = Date.now();

  const ref = await addDoc(collection(db, "orders"), {
    customer_name: data.name ?? "",
    customer_email: data.email ?? "",
    customer_phone: data.phone ?? "",
    total: Number(data.total ?? 0),
    status: data.status ?? "pending",
    items: Array(data.items ?? {}),
    notes: data.notes ?? "",
    event_date: data.event_date ?? "",
    user_uid: data.user_uid,
    created_at: now,
    updated_at: now,
  });

  return ref.id;
}

export async function updateOrder(id, data) {
  await updateDoc(doc(db, "orders", id), {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteOrder(id) {
  await deleteDoc(doc(db, "orders", id));
}
