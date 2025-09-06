"use client";
import { useState, useEffect } from "react";

export default function ReviewTable() {
  const [data, setData] = useState([]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year}\n${hours}:${minutes}, ${weekday}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/records");
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div className="font-sec flex flex-col flex-grow items-center gap-5 text-center my-8">
      <div className="flex gap-3 items-center">
        <a href="/" className="flex items-center border border-gray-200 rounded-md p-1">
          <span className="material-symbols-outlined font-light">
            chevron_left
          </span>
          Back
        </a>
        <h1 className="font-prim text-2xl font-bold">Review previous records</h1>
      </div>
      <table className="w-fit text-black border border-gray-300 mx-8">
        <thead>
          <tr className="bg-gray-100 font-prim text-center">
            <th className="border border-gray-300 p-3">Date</th>
            <th className="border border-gray-300 p-3">Items</th>
            <th className="border border-gray-300 p-3">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record: { date: string; items: { item: string; quantity: number }[]; totalPrice: number }, index) => (
            <tr key={index} className="text-white">
              <td className="border border-gray-300 p-3" style={{ whiteSpace: 'pre-line' }}>{formatDate(record.date)}</td>
              <td className="border border-gray-300 p-3">
                <div className="flex flex-col items-start">
                  {record.items.map((each, idx) => (
                    <span key={idx}>
                      {each.item.charAt(0).toUpperCase() + each.item.slice(1)} - {each.quantity}
                    </span>
                  ))}
                </div>
              </td>
              <td className="border border-gray-300 p-3">Rs.{record.totalPrice}/-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
