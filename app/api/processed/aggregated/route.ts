import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
) {

  const searchParams = request.nextUrl.searchParams
  const filter = searchParams.get('filter')

  const response = await fetch('https://dummyjson.com/products')
  const { products }= await response.json()
  const filteredProducts = filter != '' ? products.filter((product) => product.category == filter) : products


  return NextResponse.json(filteredProducts)
}
