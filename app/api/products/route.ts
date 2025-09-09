import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // make sure you have a prisma client helper
import { isAscii } from "buffer";
import { NextURL } from "next/dist/server/web/next-url";

export async function POST(req: NextRequest) {
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
      categoryIds,
    } = body;

    if (
      !sku ||
      !slug ||
      !name ||
      !description ||
      !price ||
      !origin ||
      !categoryIds
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sku,
        slug,
        name,
        description,
        price,
        compareAtPrice,
        origin,
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
    const discount = searchParams.get("discount");
    const priceTo = Number(searchParams.get("from") || "0");
    const active = searchParams.get("active");

    const products = await prisma.product.findMany({
      where: {
        isActive: active ? active === "true" : undefined,
        categories: category ? { some: { slug: category } } : undefined,
        ...(priceTo && priceTo > 0 ? { price: { lte: priceTo } } : {}),
      },
      include: {
        categories: true, // include category info
        inventory: true,
        discounts: true,
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
