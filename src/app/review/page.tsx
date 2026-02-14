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
      totalUnpaidClothes: data.reduce(
        (t, r) => t + (r.payment ? 0 : r.items),
        0,
      ),
      totalUnpaidTimes: data.reduce((t, r) => t + (r.payment ? 0 : 1), 0),
      totalUnpaidPrice: data.reduce((t, r) => t + (r.payment ? 0 : r.total), 0),
      totalPaidClothes: data.reduce((t, r) => t + (r.payment ? r.items : 0), 0),
      totalPaidTimes: data.reduce((t, r) => t + (r.payment ? 1 : 0), 0),
      totalPaidPrice: data.reduce((t, r) => t + (r.payment ? r.total : 0), 0),
    };
  }, [data]);

  return (
    <div className="font-sec max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-center gap-3">
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
          <details className="bg-gray-100 rounded-xl border cursor-pointer list-none text-center">
            <summary className="p-4 grid grid-cols-4 text-center items-center text-sm gap-3">
              {/* <p className="text-red-500 text-xs mb-1">Pending</p> */}
              <span className="material-symbols-outlined text-red-500">
                schedule
              </span>
              <div>
                <p className="text-black">Clothes</p>
                <p className="font-bold text-red-500">
                  {overallTotals.totalUnpaidClothes}
                </p>
              </div>
              <div>
                <p className="text-black">Visits</p>
                <p className="font-bold text-red-500">
                  {overallTotals.totalUnpaidTimes}
                </p>
              </div>
              <div>
                <p className="text-black">Total</p>
                <p className="font-bold text-red-500">
                  ₹{overallTotals.totalUnpaidPrice}
                </p>
              </div>
            </summary>
            <div className="p-4 grid grid-cols-4 text-center items-center text-sm gap-3">
              {/* <p className="text-green-500 text-xs mb-1">Completed</p> */}
              <span className="material-symbols-outlined text-green-500">
                check_circle
              </span>
              <div>
                <p className="text-black">Clothes</p>
                <p className="font-bold text-green-500">
                  {overallTotals.totalPaidClothes}
                </p>
              </div>
              <div>
                <p className="text-black">Visits</p>
                <p className="font-bold text-green-500">
                  {overallTotals.totalPaidTimes}
                </p>
              </div>
              <div>
                <p className="text-black">Total</p>
                <p className="font-bold text-green-500">
                  ₹{overallTotals.totalPaidPrice}
                </p>
              </div>
            </div>
            <div className="p-4 grid grid-cols-4 text-center items-center text-sm gap-3">
              {/* <p className="text-gray-700 text-xs mb-1">All</p> */}
              <span className="material-symbols-outlined text-gray-700">
                all_inclusive
              </span>
              <div>
                <p className="text-black">Clothes</p>
                <p className="font-bold text-gray-700">
                  {overallTotals.totalClothes}
                </p>
              </div>
              <div>
                <p className="text-black">Visits</p>
                <p className="font-bold text-gray-700">
                  {overallTotals.totalTimes}
                </p>
              </div>
              <div>
                <p className="text-black">Total</p>
                <p className="font-bold text-gray-700">
                  ₹{overallTotals.totalPrice}
                </p>
              </div>
            </div>
            <a
              href="/payment"
              className="inline-block text-orange-500 my-4 text-sm hover:underline"
            >
              <span className="material-symbols-outlined align-middle">
                edit
              </span>{" "}
              Edit Payment
            </a>
          </details>

          <div className="space-y-4">
            {monthlyData.map(({ month, records }) => {
              const monthClothes = records.reduce((t, r) => t + r.items, 0);
              const monthTotal = records.reduce((t, r) => t + r.total, 0);

              return (
                <details
                  key={month}
                  className="cursor-pointer list-none bg-white rounded-xl border"
                >
                  <summary className="p-4 flex justify-between items-center">
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
                                  className={`text-xs ${
                                    record.payment
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
                              <p className="font-medium text-gray-900">
                                Clothes
                              </p>
                              <div className="pl-2 mt-1 space-y-1">
                                {Object.entries(record.clothes).map(
                                  ([name, { quantity, price }], i) => (
                                    <p key={i} className="text-gray-800">
                                      {name.charAt(0).toUpperCase() +
                                        name.slice(1)}{" "}
                                      x {quantity} (₹{price})
                                    </p>
                                  ),
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
