import { db } from "../_utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/** 列表：获取所有旅游计划 */
export async function getItems(userId) {
  const items = [];
  const q = query(collection(db, "users", userId, "items"));
  const snapshot = await getDocs(q);
  snapshot.forEach((d) => {
    const data = d.data();
    items.push({
      id: d.id,
      title: data.title ?? "",
      departure: data.departure ?? "",
      destination: data.destination ?? "",
      startDate: data.startDate ?? "",
      endDate: data.endDate ?? "",
      description: data.description ?? "",        // <-- 新增
    });
  });
  return items;
}

/** 详情：获取单个旅游计划 */
export async function getItem(userId, id) {
  const ref = doc(db, "users", userId, "items", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    title: data.title ?? "",
    departure: data.departure ?? "",
    destination: data.destination ?? "",
    startDate: data.startDate ?? "",
    endDate: data.endDate ?? "",
    description: data.description ?? "",          // <-- 新增
  };
}

/** 新增：返回新文档 id */
export async function addItem(userId, item) {
  const col = collection(db, "users", userId, "items");
  const docRef = await addDoc(col, {
    title: item.title ?? "",
    departure: item.departure ?? "",
    destination: item.destination ?? "",
    startDate: item.startDate ?? "",
    endDate: item.endDate ?? "",
    description: item.description ?? "",          // <-- 新增
  });
  return docRef.id;
}

/** 更新：部分字段更新 */
export async function updateItem(userId, id, patch) {
  const ref = doc(db, "users", userId, "items", id);
  await updateDoc(ref, {
    ...(patch.title !== undefined && { title: patch.title }),
    ...(patch.departure !== undefined && { departure: patch.departure }),
    ...(patch.destination !== undefined && { destination: patch.destination }),
    ...(patch.startDate !== undefined && { startDate: patch.startDate }),
    ...(patch.endDate !== undefined && { endDate: patch.endDate }),
    ...(patch.description !== undefined && { description: patch.description }), // <-- 新增
  });
  return id;
}

/** 删除 */
export async function deleteItem(userId, id) {
  const ref = doc(db, "users", userId, "items", id);
  await deleteDoc(ref);
}