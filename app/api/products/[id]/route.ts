import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: number }}
) {
  const { id } = await params
  const response = await fetch(`https://dummyjson.com/products/${id}`)
  if(response.ok) {
    const product = await response.json()
    return NextResponse.json(product)
  
  return NextResponse.json({})
}
