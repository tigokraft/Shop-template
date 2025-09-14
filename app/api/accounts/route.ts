import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const accounts = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch {}
}
