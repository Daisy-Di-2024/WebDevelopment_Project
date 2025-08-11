import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query} from "firebase/firestore";


export async function getItems(userId) {
    const items = [];
    const q = query(
        collection(db, "users", userId, "items")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        items.push({
            id: doc.id,
            name: doc.data().name,
            quantity: doc.data().quantity,
            category: doc.data().category
        });
    })
    return items;
}

export async function addItem(userId, item) {
    const docRef = await addDoc(collection(db, "users", userId, "items"), item);
    console.log("Item is created with ID: ", docRef.id);
    return docRef.id;
}
