"use client";
import ItemList from "./item-list";
import NewItem from "./new-item"
// import itemsData from "./item.json"
import MealIdeas from "./meal-ideas";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../_utils/auth-context";
import { getItems, addItem } from "../_services/shopping-list-service"

async function loadItems(user, setItems) {
    setItems(await getItems(user.uid));
}

export default function Page() {
    const router = useRouter();
    const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

    // let itemArray = itemsData.map((item) => ({ ...item }));
    const [items, setItems] = useState([]);
    const [selectedItemName, setSelectedItemName] = useState("");

    useEffect(() => {
        if (!user) {
            router.push("/week-10");
        } else {
            loadItems(user, setItems);
        }
    }, [user, router]);

    const handleAddItem = (item) => {
        const itemId = addItem(user.uid, item);
        item.id = itemId;
        setItems([...items, item]);
    }

    const handleItemSelect = (event) => {
        const itemName = event.target.innerText.split(",")[0].replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        setSelectedItemName(itemName);
    }

    return (
        <main>
            <h1 className="text-3xl font-bold m-2">Shopping List</h1>
            <div className="flex">
                <div className="w-1/3 p-2">
                    <NewItem onAddItem={handleAddItem} />
                    <ItemList items={items} setItems={setItems} onItemSelect={handleItemSelect} />
                </div>
                <div className="flex-1 p-2">
                    <MealIdeas ingredient={selectedItemName} />
                </div>
            </div>
        </main>
    )
}