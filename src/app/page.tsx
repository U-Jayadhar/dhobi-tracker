"use client";

import { useState } from "react";
import Image from "next/image";
import "./globals.css";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState("default");
  // const [otherValue, setOtherValue] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isFocused, setIsFocus] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [cartItems, setCartItems] = useState<
    { item: string; quantity: number }[]
  >([]);

  function handleSubmit() {
    fetch("/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    }).then((response) => {
      if (response.ok) {
        alert("Records saved successfully");
      } else {
        alert("Failed to save records");
      }
    });
  }

  function handleAddToCart() {
    if (quantity === 0 || selectedItem === "default") {
      alert("Please enter a valid item and quantity");
      return;
    } else {
      const exists = cartItems.find(
        (cartItem) => cartItem.item === selectedItem,
      );
      if (exists) {
        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.item === selectedItem
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem,
          ),
        );
      } else {
        setCartItems([
          ...cartItems,
          { item: selectedItem, quantity: quantity },
        ]);
      }
      setTotalCount(totalCount + quantity);
      setSelectedItem("default");
      setQuantity(0);
    }
  }

  return (
    <main className="font-sec flex flex-col flex-grow items-center">
      <div className="flex gap-5 mt-10">
        <Image src="/iron.svg" alt="Iron icon" width={40} height={40} />
        <h1 className="font-prim font-bold text-4xl">Dhobi Tracker</h1>
      </div>
      <form
        className="flex flex-col items-center gap-4 mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex gap-4 items-center">
          <select
            onChange={(e) => setSelectedItem(e.target.value)}
            name="item"
            value={selectedItem}
            className="border border-gray-300 rounded-md p-2 text-center form-select appearance-none pr-8 pl-2 bg-no-repeat cursor-pointer"
          >
            <option value="default" defaultChecked className="text-black">
              Select Item
            </option>
            <option value="shirt" className="text-black">
              Shirt
            </option>
            <option value="pant" className="text-black">
              Pant
            </option>
            <option value="saree" className="text-black">
              Saree
            </option>
            <option value="dress" className="text-black">
              Dress
            </option>
            {/* <option value="other" className="text-black">Other</option> */}
          </select>
          {/* {selectedItem === "other" && (
            <input type="text" name="otherItem" placeholder="Enter other item"
              className="border border-gray-300 rounded-md p-2"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
            />
          )} */}
          <input
            type="number"
            name="quantity"
            value={isFocused && quantity === 0 ? "" : quantity}
            min={0}
            className="w-20 border border-gray-300 rounded-md p-2"
            onChange={(e) => setQuantity(Number(e.target.value))}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          <button
            type="button"
            className="text-white rounded-md border p-2 cursor-pointer"
            onClick={() => {
              // if (selectedItem === "other" && otherValue.trim() === "") {
              //   alert("Please enter a valid item name");
              //   return;
              // }
              // const itemName = selectedItem === "other" ? otherValue.trim() : selectedItem;
              // handleAddToCart(itemName);
              handleAddToCart();
            }}
          >
            <Image src="/add.svg" alt="Add to Cart" width={20} height={20} />
          </button>
        </div>
        {totalCount === 0 && (
          <p className="text-yellow-400/80">* Add elements to view cart</p>
        )}
        {totalCount > 0 && (
          <div className="flex flex-col items-center mt-5">
            <div className="overflow-x-auto rounded-lg text-center">
              <table className="leading-normal text-black">
                <thead>
                  <tr>
                    <th
                      colSpan={2}
                      className="px-10 py-3 border-b border-black bg-gray-100"
                    >
                      <p className="flex items-center justify-center gap-1 font-bold text-blue-500 text-xl">
                        <span className="material-symbols-outlined font-light">
                          shopping_cart
                        </span>
                        Cart Items
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((cartItem, index) => (
                    <tr key={index}>
                      <td className="px-10 py-3 border-b border-r border-black bg-white">
                        {cartItem.item.charAt(0).toUpperCase() +
                          cartItem.item.slice(1)}
                      </td>
                      <td className="px-10 py-3 border-b border-black bg-white">
                        {cartItem.quantity}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-10 py-3 border-r border-black bg-white font-bold">
                      Total Items
                    </td>
                    <td className="px-10 py-3 bg-white font-bold">
                      {totalCount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                className="border border-red-400 text-red-400 rounded-md px-4 py-2 cursor-pointer"
                onClick={() => {
                  setCartItems([]);
                  setTotalCount(0);
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                className="bg-green-400/70 text-white rounded-md px-4 py-2 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
      <button
        className="bg-blue-500 text-white rounded-md px-4 py-2 cursor-pointer self-center flex items-center mt-10"
        onClick={() => (window.location.href = "/review")}
      >
        Review records
        <span className="material-symbols-outlined font-light">
          chevron_right
        </span>
      </button>
    </main>
  );
}
