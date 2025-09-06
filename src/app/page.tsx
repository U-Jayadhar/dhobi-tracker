"use client"

import { useState } from "react";
import Image from "next/image";
import "./globals.css";


export default function Home() {

  const [selectedItem, setSelectedItem] = useState("default");
  // const [otherValue, setOtherValue] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [cartItems, setCartItems] = useState<{ item: string; quantity: number }[]>([]);

  function handleSubmit() {
    fetch("/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cartItems)
    })
      .then((response) => {
        if (response.ok) {
          alert("Records saved successfully");
        } else {
          alert("Failed to save records");
        }
      });
  }

  function handleAddToCart() {
    if (quantity === 0) {
      alert("Please enter a valid quantity");
      return;
    } else {
      const exists = cartItems.find(cartItem => cartItem.item === selectedItem);
      if (exists) {
        setCartItems(cartItems.map(cartItem =>
          cartItem.item === selectedItem
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        ));
      } else {
        setCartItems([...cartItems, { item: selectedItem, quantity: quantity }]);
      }
      setTotalCount(totalCount + quantity);
      setSelectedItem("default");
      setQuantity(0);
    }
  };

  return (
    <main className="font-sec flex flex-col flex-grow items-center">
      <div className="flex gap-5 mt-10">
        <Image
          src="/iron.svg"
          alt="Iron icon"
          width={40}
          height={40}
        />
        <h1 className="font-prim font-bold text-4xl">Dhobi Tracker</h1>
      </div>
      <form className="flex flex-col items-center gap-4 my-10" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="flex gap-4 items-center">
          <select onChange={(e) => setSelectedItem(e.target.value)} name="item" value={selectedItem} className="border border-gray-300 rounded-md p-2 text-center form-select appearance-none pr-8 pl-2 bg-no-repeat cursor-pointer">
            <option value="default" defaultChecked className="text-black">Select Item</option>
            <option value="shirt" className="text-black">Shirt</option>
            <option value="pant" className="text-black">Pant</option>
            <option value="saree" className="text-black">Saree</option>
            <option value="dress" className="text-black">Dress</option>
            {/* <option value="other" className="text-black">Other</option> */}
          </select>
          {/* {selectedItem === "other" && (
            <input type="text" name="otherItem" placeholder="Enter other item"
              className="border border-gray-300 rounded-md p-2"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
            />
          )} */}
          <input type="number" name="quantity" value={quantity} className="w-20 border border-gray-300 rounded-md p-2"
            onChange={(e) => setQuantity(Number(e.target.value))} />
          <button type="button" className="text-white rounded-md border p-2 cursor-pointer" onClick={() => {
            // if (selectedItem === "other" && otherValue.trim() === "") {
            //   alert("Please enter a valid item name");
            //   return;
            // }
            // const itemName = selectedItem === "other" ? otherValue.trim() : selectedItem;
            // handleAddToCart(itemName);
            handleAddToCart();
          }}>
            <Image src="/add.svg" alt="Add to Cart" width={20} height={20} />
          </button>
        </div>
        {totalCount > 0 && (
          <div className="text-center">
            <p className="font-prim">Items Added:</p>
            <ul className="list-none text-lg">
              {cartItems.map((cartItem, index) => (
                <li key={index}>{cartItem.item.charAt(0).toUpperCase() + cartItem.item.slice(1)} - {cartItem.quantity}</li>
              ))}
            </ul>
            <p>Total Items: {totalCount}</p>
          </div>
        )}
        <button type="submit" className="bg-green-400/70 text-white rounded-md px-4 py-2 cursor-pointer">Submit</button>
      </form >
      <button className="bg-blue-500 text-white rounded-md px-4 py-2 cursor-pointer self-center flex items-center" onClick={() => window.location.href = '/review'}>
        Review
        <span className="material-symbols-outlined font-light">
          chevron_right
        </span>
      </button>
    </main>
  );
}
