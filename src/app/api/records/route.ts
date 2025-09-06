import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

async function getRecords() {
  const recordsPath = path.join(process.cwd(), "data", "records.json");
  const data = await fs.promises.readFile(recordsPath, "utf-8");
  return JSON.parse(data);
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const records = await getRecords();
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read records", status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const records = await getRecords();
    const body = await req.json();
    const newRecords = {
      date: new Date().toString(),
      items: body,
      totalPrice: body.reduce(
        (
          total: number,
          clothes: { item: string; quantity: number },
        ): number => {
          if (clothes.item === "shirt" || clothes.item === "pant") {
            return total + clothes.quantity * 10;
          } else if (clothes.item === "saree" || clothes.item === "dress") {
            return total + clothes.quantity * 20;
          }
          return total;
        },
        0,
      ),
    };
    const updatedRecords = [newRecords, ...records];

    const recordsPath = path.join(process.cwd(), "data", "records.json");
    await fs.promises.writeFile(
      recordsPath,
      JSON.stringify(updatedRecords, null, 2),
    );
    return NextResponse.json({
      message: "Records saved successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error saving records:", error);
    return NextResponse.json({ error: "Failed to save records", status: 500 });
  }
}
