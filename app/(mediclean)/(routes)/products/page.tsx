import { Metadata } from 'next'
import ProductsClientComponent from '@/components/product/AllProductsPage/ProductsClientComponent'
import { StructuredData } from '@/components/SEO/StructuredData'
import { generateProductsMetadata, generateProductsSchema } from '@/lib/seo/structured-data'

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams.category as string
  return generateProductsMetadata(category)
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams.category as string

    return (
        <>
            <StructuredData data={generateProductsSchema(category)} />
            <ProductsClientComponent />
        </>
    )
}
