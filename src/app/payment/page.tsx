"use client";

import { useEffect, useMemo, useState } from "react";

type RecordType = {
  date: string;
  items: number;
  clothes: { [name: string]: { quantity: number; price: number } };
  total: number;
  payment: boolean;
  notes: string;
};

export default function PaymentPage() {
  const [data, setData] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/records");
      const result = await res.json();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  const totals = useMemo(() => {
    return {
      visits: data.length,
      clothes: data.reduce((t, r) => t + r.items, 0),
      amount: data.reduce((t, r) => t + r.total, 0),
    };
  }, [data]);

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

  return (
    <div className="font-sec max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-center gap-3">
        <a
          href="/review"
          className="flex items-center border rounded-md px-2 py-1 text-sm text-white border-gray-600"
        >
          <span className="material-symbols-outlined text-lg text-white">
            chevron_left
          </span>
          Back
        </a>
        <h1 className="text-xl font-bold text-white">Payment</h1>
      </div>
      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-center text-white">No records found.</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border p-4 space-y-3">
            <div className="grid grid-cols-3 text-center text-sm">
              <div>
                <p className="text-gray-600">Visits</p>
                <p className="font-semibold text-black">{totals.visits}</p>
              </div>
              <div>
                <p className="text-gray-600">Clothes</p>
                <p className="font-semibold text-black">{totals.clothes}</p>
              </div>
              <div>
                <p className="text-gray-600">Total</p>
                <p className="font-semibold text-black">₹{totals.amount}</p>
              </div>
              <button
                className="col-span-3 mt-3 p-2 rounded-xl text-sm bg-blue-600 hover:cursor-pointer"
                onClick={() => {
                  fetch("/api/records", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  }).then((response) => {
                    if (response.ok) {
                      alert("Records saved successfully!");
                    } else {
                      alert("Failed to save records.");
                    }
                  });
                }}
              >
                Save records
              </button>
            </div>
          </div>

          <div>
            {data.map((record, index) => (
              <div key={index} className="bg-white rounded-xl border p-4 mb-4">
                <div className="flex items-center justify-between mb-2 gap-5">
                  <p className="text-sm text-gray-600">
                    {formatDate(record.date).full},{" "}
                    {formatDate(record.date).weekday.slice(0, 3)}
                  </p>
                  <p className="text-black">Total: ₹{record.total}</p>
                </div>
                <div className="flex items-center mb-2">
                  <p
                    className={`text-sm font-semibold ${record.payment ? "text-green-600" : "text-red-600"}`}
                  >
                    {record.payment ? "Paid" : "Unpaid"}
                  </p>
                  <button
                    className="ml-auto text-sm text-blue-600 hover:underline hover:cursor-pointer"
                    onClick={() => {
                      const newData = [...data];
                      newData[index].payment = !newData[index].payment;
                      setData(newData);
                    }}
                  >
                    Mark as {record.payment ? "Unpaid ❌" : "Paid ✅"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
