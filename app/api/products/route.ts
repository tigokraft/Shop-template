import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // make sure you have a prisma client helper
import { isAscii } from "buffer";
import { NextURL } from "next/dist/server/web/next-url";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      sku,
      slug,
      name,
      description,
      price,
      compareAtPrice,
      origin,
      stock,
      categoryIds,
    } = body;

    // Validate required fields
    if (!sku || !slug || !name || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        sku,
        slug,
        name,
        description,
        price,
        compareAtPrice,
        origin,
        stock: stock ?? 0,
        categories: categoryIds
          ? {
              connect: categoryIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("Error creating product:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl; // allows params ex: "api/products?skip=10&take=5"

    const take = parseInt(searchParams.get("show") || "12", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const category = searchParams.get("category");
    const discount = parseInt(searchParams.get("discount") || "0", 10);
    const priceTo = Number(searchParams.get("from") || "0");
    const active = searchParams.get("active");

    const products = await prisma.product.findMany({
      where: {
        isActive: active ? active === "true" : undefined,
        categories: category ? { some: { slug: category } } : undefined,
        price: { lte: priceTo },
      },
      include: {
        categories: true, // include category info
      },
      take,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(products);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
