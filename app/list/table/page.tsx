'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Loading from '@/components/shared/Loading'
import Error from '@/components/shared/Error'

type Product = {
  id: number,
  title: string
  category: string
  price: number
  images: string[]
}

export default function ListTableIndexPage() {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['listProducts', category],
    queryFn: async () => {
      const response = await fetch(`/api/processed/aggregated?filter=${category}`)
      return response.json()
    }
  })

  if(isLoading) {
    return <Loading />
  }

  if(isError) {
    return <Error />
  }

  const filters: string[] = ['beauty', 'fragrances', 'furniture', 'groceries']
  const stockLevel: number = products.reduce((acc: number, product: Product) => {
    return acc + product.stock
  }, 0)
  const averagePrice: number = (products.reduce((acc: number, product: Product) => {
    return acc + product.price
  }, 0) / products.length).toFixed(2)
  const groupByCategory = Object.groupBy(products, (product: Product) => product.category) 
  let mostCommonCategory: string = '';
  let maxCount: number = 0;

  for (const [category, items] of Object.entries(groupByCategory)) {
    if (items.length > maxCount) {
      maxCount = items.length;
      mostCommonCategory = category;
    }
  }


  return (
    <div className="flex flex-col w-full justify-center items-center mt-5">
      <select defaultValue={category} className="p-2 bg-blue-500 rounded-2xl" onChange={(e) => setCategory(e.target.value)}>
        <option value='' className="text-center">Select option</option>
        {filters.map((filter: string) => (
          <option key={filter} value={filter} className="text-center">{filter.toUpperCase()}</option>
        ))}
        <option value='' className="text-center">All</option>
      </select>
      <section className="flex justify-around items-center w-1/2">
        <HighlightSection title='Stock Level' value={stockLevel} />
        <HighlightSection title='Average Price' value={averagePrice} />
        { !category && <HighlightSection title='Most Common Category' value={mostCommonCategory.toUpperCase()} />}

      </section>
      <table className="w-3/4">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {
            products.map((product: Product) => <ProductItem product={product} router={router} key={product.id}/>)
          }
        </tbody>
      </table>      
    </div>
  )
}

const HighlightSection = ({ title, value }: { title: string, value: string | number}) => {
  return (
    <section className="m-5 border-4 border-green-400 rounded-2xl p-2 text-center">
      {title} <p className="font-bold">{value}</p>
    </section>
  )
}

const ProductItem = ({ product, router }: { product: Product, router: AppRouterInstance}) => {
  return (
    <tr className="cursor-pointer hover:bg-gray-100"onClick={() => router.push(`/products/${product.id}`)}>
      <td className="flex justify-center"><Image src={product.images[0]} alt={product.title} height={100} width={100}/></td>
      <td className="text-center">{product.title}</td>
      <td className="text-center">{product.price}</td>
      <td className="text-center">{product.category}</td>
    </tr>
  )
}
