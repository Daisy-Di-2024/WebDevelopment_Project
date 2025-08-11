"use client";
import { useState } from "react";

function getRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length);
}

export default function NewItem({ onAddItem }) {
    const [quantity, setQuantity] = useState(1);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("produce");

    const handleSubmit = (e) => {
        e.preventDefault();
        const item = {
            name,
            category,
            quantity
        };
        console.log("Item submitted:", { ...item, id: getRandomString(16) });
        onAddItem(item)
        // Reset form fields
        setName("");
        setCategory("produce");
        setQuantity(1);
    }

    const increment = () => {
        if (quantity < 20) setQuantity(quantity + 1);
    };

    const decrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const categoryData = [
        { value: "produce", display: "Produce" },
        { value: "Dairy", display: "Dairy" },
        { value: "Bakery", display: "Bakery" },
        { value: "Meat", display: "Meat" },
        { value: "Frozen Foods", display: "Frozen Foods" },
        { value: "Canned Goods", display: "Canned Goods" },
        { value: "Dry Goods", display: "Dry Goods" },
        { value: "Beverages", display: "Beverages" },
        { value: "Snacks", display: "Snacks" },
        { value: "Household", display: "Household" },
        { value: "Other", display: "Other" },
    ];

    return (
        <form
            onSubmit={handleSubmit}
            className="p-2 m-4 bg-slate-900 text-black max-w-sm w-full"
        >
            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Item name"
                    required={true}
                    className="w-full mt-1 border-2 border-gray-300 p-2 rounded-lg font-sans bg-white"
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                ></input>
            </div>
            <div className="flex justify-between">
                <div className="p-2 mt-1 mb-1 rounded-md  bg-white text-white w-36">
                    <div className="flex justify-between">

                        <span className="text-black">{quantity}</span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={decrement}
                                disabled={quantity === 1}
                                className={`px-4 py-1 rounded text-white font-bold 
            ${quantity === 1 ? 'bg-gray-400' : 'bg-blue-400 hover:bg-blue-600'}`}
                            >
                                -
                            </button>

                            <button
                                type="button"
                                onClick={increment}
                                disabled={quantity === 20}
                                className={`px-4 py-1 rounded text-white font-bold
                ${quantity === 20 ? 'bg-gray-400' : 'bg-blue-400 hover:bg-blue-600'}`}
                            >+</button>
                        </div>
                    </div>
                </div>
                <select
                    className="ml-1 border-2 border-gray-300 p-2 rounded-lg font-sans bg-white"
                    value={category}
                    onChange={(event) => {
                        setCategory(event.target.value);
                    }}
                >
                    {categoryData.map((item, index) => {
                        return <option key={index} value={item.value}>{item.display}</option>;
                    })}
                </select>
            </div>
            <button type="submit" className="w-full mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">+</button>

        </form>
    );
}