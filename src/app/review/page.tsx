"use client";
import { useState, useEffect } from "react";

type RecordType = {
  date: string;
  items: { item: string; quantity: number }[];
  totalPrice: number;
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
              <th className="text-black border-b border-r border-black p-3">
                Date
              </th>
              <th className="text-black border-b border-r border-black p-3">
                Items
              </th>
              <th className="text-black border-b border-black p-3">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (data && data.length > 0) {
                const monthName = new Date(data[0].date).toLocaleString(
                  "default",
                  { month: "long" },
                );
                const totalClothes = data.reduce((total, record) => {
                  return (
                    total +
                    record.items.reduce(
                      (itemTotal, item) => itemTotal + item.quantity,
                      0,
                    )
                  );
                }, 0);
                const totalTimes = data.length;
                const totalPrice = data.reduce(
                  (total, record) => total + record.totalPrice,
                  0,
                );

                return (
                  <>
                    <tr className="h-2 font-bold text-yellow-400">
                      <td className="border border-gray-300 p-3">
                        {monthName}
                      </td>
                      <td className="border border-gray-300 p-3">
                        Clothes: {totalClothes} <br />
                        Times: {totalTimes}
                      </td>
                      <td className="border border-gray-300 p-3">
                        Rs.{totalPrice}/-
                      </td>
                    </tr>
                    {data.map(
                      (
                        record: {
                          date: string;
                          items: { item: string; quantity: number }[];
                          totalPrice: number;
                        },
                        index,
                      ) => (
                        <tr key={index} className="text-white">
                          <td
                            className="border border-gray-300 p-3"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {formatDate(record.date)}
                          </td>
                          <td className="border border-gray-300 p-3">
                            <div className="flex flex-col">
                              {record.items.map((each, idx) => (
                                <span key={idx}>
                                  {each.item.charAt(0).toUpperCase() +
                                    each.item.slice(1)}{" "}
                                  - {each.quantity}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="border border-gray-300 p-3">
                            Rs.{record.totalPrice}/-
                          </td>
                        </tr>
                      ),
                    )}
                  </>
                );
              } else {
                return null;
              }
            })()}
          </tbody>
        </table>
      )}
    </div>
  );
}
