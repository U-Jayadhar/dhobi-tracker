import { NextRequest, NextResponse } from "next/server";

const url = `https://api.github.com/gists/${process.env.GITHUB_GIST_ID}`;
const token = process.env.GITHUB_TOKEN;

async function getRecords() {
  try {
    if (!url || !token) {
      throw new Error("GITHUB_GIST_URL or GITHUB_TOKEN is not defined");
    }
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const records = JSON.parse(data.files["records.json"].content);
    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
}

async function saveRecords(records: any[]) {
  try {
    if (!url || !token) {
      throw new Error("GITHUB_GIST_URL or GITHUB_TOKEN is not defined");
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          "records.json": {
            content: JSON.stringify(records, null, 2),
          },
        },
      }),
    });

    if (!response.ok) {
      console.error(
        "Error updating Gist:",
        response.status,
        response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating Gist:", error);
    return false;
  }
}

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const records = await getRecords();
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read records" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: any }) {
  try {
    const body = await req.json();
    const records = await getRecords();
    const updatedRecords = [
      {
        date: new Date().toString(),
        ...body,
      },
      ...records,
    ];

    const lastRes = await saveRecords(updatedRecords);
    console.log(lastRes);
    if (lastRes) {
      return NextResponse.json(
        { message: "Records saved successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to save records" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error saving records:", error);
    return NextResponse.json(
      { error: "Failed to save records" },
      { status: 500 }
    );
  }
}
