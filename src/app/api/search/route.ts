import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({
        products: [],
        brands: [],
        categories: [],
      });
    }

    const searchTerm = query.toLowerCase();

    const [products, brands, categories] = await Promise.all([
      // Search products
      prisma.product.findMany({
        where: {
          isArchived: false,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          brand: { select: { name: true } },
        },
        take: 5,
      }),
      // Search brands
      prisma.brand.findMany({
        where: {
          name: { contains: searchTerm, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
        },
        take: 3,
      }),
      // Search categories
      prisma.category.findMany({
        where: {
          name: { contains: searchTerm, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
        },
        take: 3,
      }),
    ]);

    return NextResponse.json({
      products,
      brands,
      categories,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
