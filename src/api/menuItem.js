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

export async function listItems(filters = {}) {
  let q = collection(db, "items");

  if (filters.featured !== undefined && filters.available !== undefined) {
    q = query(
      q,
      where("available", "==", filters.available),
      where("featured", "==", filters.featured),
    );
  } else if (filters.available !== undefined) {
    q = query(q, where("available", "==", filters.available));
  } else if (filters.featured !== undefined) {
    q = query(q, where("featured", "==", filters.featured));
  } else {
    q = query(q, orderBy("name", "asc"));
  }

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
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
    has_sizes: data.has_sizes ?? false,
    has_sauces: data.has_sauces ?? false,
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
