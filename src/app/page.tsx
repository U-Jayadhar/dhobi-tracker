"use client";

import { useState } from "react";
import Image from "next/image";
import "./globals.css";
import clothes from "../data/clothes.json";

export default function Home() {
  const [cartItems, setCartItems] = useState<{
    [item: string]: { quantity: number; price: number };
  }>({});
  const [totalCount, setTotalCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [sideNotes, setSideNotes] = useState("");
  const [focusMapQ, setFocusMapQ] = useState<{ [item: string]: boolean }>({});
  const [focusMapP, setFocusMapP] = useState<{ [item: string]: boolean }>({});
  const [loader, setLoader] = useState(false);

  function handleSubmit() {
    setLoader(true);
    fetch("/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: totalCount,
        clothes: cartItems,
        total: totalPrice,
        payment: false,
        notes: sideNotes,
      }),
    }).then((response) => {
      if (response.ok) {
        setLoader(false);
        setTotalCount(0);
        setTotalPrice(0);
        setCartItems({});
        setSideNotes("");
        alert("Records saved successfully");
      } else {
        alert("Failed to save records");
      }
    });
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
        <div className="flex flex-col gap-4 items-center">
          {clothes.map((cloth) => (
            <div key={cloth.name} className="flex items-center gap-5">
              <label className="w-20 bg-gray-200 p-2 rounded-md text-black text-center">
                {cloth.name.charAt(0).toUpperCase() + cloth.name.slice(1)}
              </label>
              <div className="flex items-center border border-gray-300 rounded-md py-2">
                <label className="text-blue-400 mx-2">Quantity</label>
                |
                <input
                  className="max-w-10 text-center"
                  type="number"
                  min={0}
                  value={
                    focusMapQ[cloth.name] &&
                      (cartItems[cloth.name]?.quantity === 0 ||
                        isNaN(cartItems[cloth.name]?.quantity))
                      ? ""
                      : cartItems[cloth.name]?.quantity || 0
                  }
                  onFocus={() =>
                    setFocusMapQ((prev) => ({ ...prev, [cloth.name]: true }))
                  }
                  onBlur={() =>
                    setFocusMapQ((prev) => ({ ...prev, [cloth.name]: false }))
                  }
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value));
                    setCartItems((prev) => {
                      const updated = {
                        ...prev,
                        [cloth.name]: {
                          quantity: value,
                          price: cloth.price,
                        },
                      };
                      const newTotal = Object.values(updated).reduce(
                        (sum, item) => sum + (item.quantity || 0),
                        0,
                      );
                      setTotalCount(newTotal);
                      const newPrice = Object.values(updated).reduce(
                        (total, item) => total + item.quantity * item.price,
                        0,
                      );
                      setTotalPrice(newPrice);
                      return updated;
                    });
                  }}
                />
              </div>
              <div className="flex text-center items-center border border-gray-300 rounded-md py-2">
                <label className="text-orange-400 mx-2">Price</label>
                |
                <input
                  className="max-w-10 text-center"
                  type="number"
                  min={0}
                  value={
                    focusMapP[cloth.name] &&
                      (cartItems[cloth.name]?.price === 0 ||
                        isNaN(cartItems[cloth.name]?.price))
                      ? ""
                      : cartItems[cloth.name]?.price || cloth.price
                  }
                  onFocus={() =>
                    setFocusMapP((prev) => ({ ...prev, [cloth.name]: true }))
                  }
                  onBlur={() =>
                    setFocusMapP((prev) => ({ ...prev, [cloth.name]: false }))
                  }
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value));
                    setCartItems((prev) => {
                      const updated = {
                        ...prev,
                        [cloth.name]: {
                          ...prev[cloth.name],
                          price: value,
                        },
                      };
                      const newPrice = Object.values(updated).reduce(
                        (total, item) => total + item.quantity * item.price,
                        0,
                      );
                      setTotalPrice(newPrice);
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-5">
            <label className="w-20 bg-gray-200 p-2 rounded-md text-black text-center">
              Notes
            </label>
            <input
              className="border border-gray-300 rounded-md p-2 w-64"
              type="text"
              value={sideNotes}
              onChange={(e) => setSideNotes(e.target.value)}
              placeholder="Any additional notes..."
            />
          </div>
        </div>
        {totalCount === 0 && (
          <p className="text-yellow-400/80 mt-2">
            * Add elements to submit new record
          </p>
        )}
        {totalCount > 0 && (
          <>
            <div className="flex gap-2 items-center mt-5">
              <div className="bg-blue-100 text-black p-1.5 rounded text-lg">
                Total items:{" "}
                <span className="text-blue-600 font-bold">{totalCount}</span>
              </div>
              <div className="bg-orange-100 text-black p-1.5 rounded text-lg">
                Total Price:{" "}
                <span className="text-orange-600 font-bold">₹{totalPrice}</span>
              </div>
            </div>
            <div className="flex gap-4 items-center mt-2">
              <button
                type="button"
                className="border border-red-400 text-red-400 rounded-md px-4 py-2 cursor-pointer"
                onClick={() => {
                  setTotalCount(0);
                  setCartItems({});
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                className="bg-green-400/70 text-white rounded-md px-4 py-2 cursor-pointer flex items-center"
              >
                {loader ? <span className="loader"></span> : "Submit"}
              </button>
            </div>
          </>
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
