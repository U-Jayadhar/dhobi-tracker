"use client";

import React, { useEffect, useMemo, useState } from "react";

type RecordType = {
  date: string;
  items: number;
  clothes: { [name: string]: { quantity: number; price: number } };
  total: number;
  payment: boolean;
  notes: string;
};

export default function ReviewPage() {
  const [data, setData] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(true);


  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      weekday: date.toLocaleString("en-IN", { weekday: "long" }),
    };
  }


  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/records");
      const result = await res.json();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, []);


  const monthlyData = useMemo(() => {
    const grouped: Record<string, RecordType[]> = {};

    data.forEach((record) => {
      const month = new Date(record.date).toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      });

      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(record);
    });

    return Object.entries(grouped).map(([month, records]) => ({
      month,
      records,
    }));
  }, [data]);


  const overallTotals = useMemo(() => {
    return {
      totalClothes: data.reduce((t, r) => t + r.items, 0),
      totalTimes: data.length,
      totalPrice: data.reduce((t, r) => t + r.total, 0),
    };
  }, [data]);


  return (
    <div className="font-sec max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="flex items-center border rounded-md px-2 py-1 text-sm text-white border-gray-600"
        >
          <span className="material-symbols-outlined text-lg text-white">
            chevron_left
          </span>
          Back
        </a>
        <h1 className="text-xl font-bold text-white">Review Records</h1>
      </div>

      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-center text-white">No records found.</p>
      ) : (
        <>
          <div className="bg-gray-100 rounded-xl p-4 shadow-sm grid grid-cols-3 text-center text-sm">
            <div>
              <p className="text-gray-500">Clothes</p>
              <p className="font-bold text-black">{overallTotals.totalClothes}</p>
            </div>
            <div>
              <p className="text-gray-500">Visits</p>
              <p className="font-bold text-black">{overallTotals.totalTimes}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-bold text-black">₹{overallTotals.totalPrice}</p>
            </div>
          </div>

          <div className="space-y-4">
            {monthlyData.map(({ month, records }) => {
              const monthClothes = records.reduce((t, r) => t + r.items, 0);
              const monthTotal = records.reduce((t, r) => t + r.total, 0);

              return (
                <details
                  key={month}
                  className="bg-white rounded-xl shadow border open:shadow-md"
                >
                  <summary className="cursor-pointer list-none p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-black">{month}</p>
                      <p className="text-xs text-gray-600">
                        {records.length} visits • {monthClothes} clothes
                      </p>
                    </div>
                    <p className="font-semibold text-black">₹{monthTotal}</p>
                  </summary>

                  <div className="border-t border-black px-4 py-4 space-y-3">
                    {records.map((record, idx) => {
                      const date = formatDate(record.date);

                      return (
                        <details
                          key={idx}
                          className="bg-gray-200 rounded-lg p-3"
                        >
                          <summary className="cursor-pointer list-none">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-black">
                                  {date.full}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {date.time} • {date.weekday.slice(0, 3)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-black">
                                  ₹{record.total}
                                </p>
                                <span
                                  className={`text-xs ${record.payment
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                                >
                                  {record.payment ? "Paid" : "Pending"}
                                </span>
                              </div>
                            </div>
                          </summary>

                          <div className="mt-3 text-sm space-y-2 text-gray-800">
                            <div>
                              <p className="font-medium text-gray-900">Clothes</p>
                              <div className="pl-2 mt-1 space-y-1">
                                {Object.entries(record.clothes).map(
                                  ([name, { quantity, price }], i) => (
                                    <p key={i} className="text-gray-800">
                                      {name.charAt(0).toUpperCase() +
                                        name.slice(1)}{" "}
                                      x {quantity} (₹{price})
                                    </p>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="flex justify-between border-t pt-2 border-gray-300">
                              <span>Items</span>
                              <span>{record.items}</span>
                            </div>

                            {record.notes && (
                              <p className="text-xs italic text-gray-600 border-t pt-2">
                                “{record.notes}”
                              </p>
                            )}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
