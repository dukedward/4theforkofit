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

export async function listOrders(filters = {}) {
  let q = collection(db, "orders");

  if (filters.created_at !== undefined) {
    q = query(q, where("created_at", "==", filters.created_at));
  } else if (filters.customer_email !== undefined) {
    q = query(q, where("created_at", "==", filters.customer_email));
  }

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function createOrder(order) {
  const now = Date.now();
  const payload = {
    customer_name: order.customer_name || "",
    customer_email: order.customer_email || "",
    customer_phone: order.customer_phone || "",
    total: Number(order.total || 0),
    status: "pending",
    items: (order.items || []).map((item) => ({
      menu_item_id: item.menu_item_id || "",
      name: item.name || "",
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 0),
    })),
    notes: order.notes || "",
    event_date: order.event_date || "",
    created_at: now,
  };

  return await addDoc(collection(db, "orders"), payload);
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
