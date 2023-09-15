import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";

// adds a new github user to the database
export async function POST(req: NextRequest) {
  const db = await getDb();
  const id = parseInt(req.nextUrl.searchParams.get("id") as string);

  if (!id) {
    return NextResponse.json({ error: "No id provided" }, { status: 400 });
  }

  const githubResponse = await fetch(`https://api.github.com/user/${id}`);
  const githubBody = await githubResponse.clone().json();

  const username = githubBody.login;
  const repos_url = githubBody.repos_url;
  const avatar_url = githubBody.avatar_url;

  if (!username || !repos_url || !avatar_url) {
    return NextResponse.json(
      { error: "Github user does not have all required fields" },
      { status: 400 }
    );
  }

  try {
    const doc = {
      id: id,
      username,
      repos_url,
      avatar_url,
    };
    const users = db.collection("users");

    users.insertOne(doc);
  } catch (e) {
    return NextResponse.json(
      { error: "Error inserting user into database" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Successfully added user to database",
    user: {
      id,
      username,
      repos_url,
      avatar_url,
    },
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") as string;

  if (!id) {
    return NextResponse.json({ error: "No id provided" }, { status: 400 });
  }

  const githubResponse = await fetch(`https://api.github.com/user/${id}`);
  const githubBody = await githubResponse.clone().json();

  return NextResponse.json(githubBody);
}
