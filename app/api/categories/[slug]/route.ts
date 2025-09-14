import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = params;

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { products: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    } else if (category.products.length === 0) {
      return NextResponse.json(
        { message: "No products found in this category" },
        { status: 200 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching category:", err);
    return NextResponse.json(
      { error: "Internal Server Error", errorDetails: err.message },
      { status: 500 }
    );
  }
}
