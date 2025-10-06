'use client'

import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Loading from "@/components/shared/Loading"
import Error from "@/components/shared/Error"

export default function ProductShowPage() {
  const { id } = useParams()
  const router =  useRouter()
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`)
      const product = await response.json()
      return product
    }
  })

  if(isLoading) {
    return <Loading />
  }

  if(isError) {
    return <Error />
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-5">
      <Image src={product.images[0]} alt={product.title} height={100} width={100}/>
      <p>
        Name: {product.title}
      </p>
      <p>
        Price: {product.price}
      </p>
      <p className="w-1/2 text-wrap text-center">
        Description: {product.description}
      </p>
      <p>
        Rating: {product.rating}
      </p>
      <p>
        Stock: {product.stock}
      </p>
      <p>
        Category: {product.category.toUpperCase()}
      </p>
      <button className="bg-blue-400 text-black rounded-2xl p-5 cursor-pointer hover:bg-blue-500" onClick={() => router.back()}>
        Back
      </button>
    </div>
  )
}
