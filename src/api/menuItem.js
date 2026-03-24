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

export async function listItems(userUid) {
  const q = query(
    collection(db, "items"),
    where("user_uid", "==", userUid),
    orderBy("created_at", "desc"),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function createItem(data) {
  const now = Date.now();

  const ref = await addDoc(collection(db, "items"), {
    name: data.name ?? "",
    description: data.description ?? "",
    price: Number(data.price ?? 0),
    category: data.category ?? "Entrees",
    image_url: data.image_url ?? "",
    featured: data.featured ?? false,
    available: data.available ?? true,
    created_at: now,
    updated_at: now,
  });

  return ref.id;
}

export async function updateItem(id, data) {
  await updateDoc(doc(db, "items", id), {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteItem(id) {
  await deleteDoc(doc(db, "items", id));
}
