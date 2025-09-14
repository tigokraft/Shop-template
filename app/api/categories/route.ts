import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err: any) {
    console.error("Error creating category:", err);
    return NextResponse.json(
      { error: "Internal Server Error", errorDetails: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const name = searchParams.get("name");

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (err: any) {
    console.error("Error fetching categories:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
