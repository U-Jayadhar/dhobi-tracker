"use client";
import React from "react";
import { useState, useEffect, useMemo } from "react";

type RecordType = {
  date: string;
  items: number;
  clothes: { [name: string]: { quantity: number; price: number } };
  price: number;
};

export default function ReviewTable() {
  const [data, setData] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(true);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const weekday = date.toLocaleString("en-US", { weekday: "long" });
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year}\n${hours}:${minutes}, ${weekday}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/records");
      const result = await response.json();

      setData(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  const monthlyData = useMemo<{ month: string; records: RecordType[] }[]>(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const grouped: Record<string, RecordType[]> = data.reduce((acc, record) => {
      const month = new Date(record.date).toLocaleString("default", { month: "long" });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(record);
      return acc;
    }, {} as Record<string, RecordType[]>);

    return Object.entries(grouped).map(([month, records]) => ({
      month,
      records,
    }));
  }, [data]);

  const overallTotals = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalClothes: 0, totalTimes: 0, price: 0 };
    }

    const totalClothes = data.reduce((total, record) => total + record.items, 0);
    const totalTimes = data.length;
    const price = data.reduce((total, record) => total + record.price, 0);

    return { totalClothes, totalTimes, price };
  }, [data]);

  return (
    <div className="font-sec flex flex-col flex-grow items-center gap-5 text-center my-8">
      <div className="flex gap-4   items-center">
        <a
          href="/"
          className="flex items-center border border-gray-200 rounded-md p-1 text-sm"
        >
          <span className="material-symbols-outlined font-light">
            chevron_left
          </span>
          Back
        </a>
        <h1 className="text-2xl font-bold">Review previous records</h1>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table className="mt-10 rounded-lg overflow-hidden leading-normal">
          <thead>
            <tr className="bg-gray-100 font-prim text-center">
              <th className="text-black border-b border-r border-black p-3">Date</th>
              <th className="text-black border-b border-r border-black p-3">Items</th>
              <th className="text-black border-b border-black p-3">Total Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-2 font-bold text-blue-400"> 
              <td className="border border-gray-300 p-3">Total</td>
              <td className="border border-gray-300 p-3">
                Clothes: {overallTotals.totalClothes} <br />
                Total Times: {overallTotals.totalTimes}
              </td>
              <td className="border border-gray-300 p-3">Rs.{overallTotals.price}/-</td>
            </tr>

            {monthlyData.map(({ month, records }) => {
              const totalClothes = records.reduce((total, record) => total + record.items, 0);
              const price = records.reduce((total, record) => total + record.price, 0);

              return (
                <React.Fragment key={month}>
                  <tr className="h-2 font-bold text-yellow-400">
                    <td className="border border-gray-300 p-3">{month}</td>
                    <td className="border border-gray-300 p-3">
                      Clothes: {totalClothes} <br />
                      Total Times: {records.length}
                    </td>
                    <td className="border border-gray-300 p-3">Rs.{price}/-</td>
                  </tr>
                  {records.map(
                    (
                      record: {
                        date: string;
                        items: number;
                        clothes: {
                          [name: string]: { quantity: number; price: number };
                        };
                        price: number;
                      },
                      index,
                    ) => (
                      <tr key={`${month}-${index}`} className="text-white">
                        <td
                          className="border border-gray-300 p-3"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {formatDate(record.date)}
                        </td>
                        <td className="border border-gray-300 p-3">
                          <div className="flex flex-col text-start">
                            {Object.entries(record.clothes).map(
                              ([item, { quantity, price }], idx) => (
                                <span key={idx}>
                                  {item.charAt(0).toUpperCase() + item.slice(1)} - {quantity}(₹{price})
                                </span>
                              )
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-300 p-3">Rs.{record.price}/-</td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
