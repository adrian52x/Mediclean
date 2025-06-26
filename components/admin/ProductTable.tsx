'use client';

import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryEnum, ProductDetails } from "@/types";
import { useGetProducts } from "@/lib/hooks/useProducts";
import { Loader } from "../ui/loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useGetProductTypes } from "@/lib/hooks/useProducTypes";
import { Separator } from "../ui/separator";
import React from "react";
import { CircleCheck, Minus } from "lucide-react";


export default function ProductTable() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string | "">("all");
    const [subCategory, setSubCategory] = useState<string | "">("all");
    const [selectedRow, setSelectedRow] = useState<ProductDetails | null>(null);
    const [stomatologie, setStomatologie] = useState(false);
    const [medicinaGenerala, setMedicinaGenerala] = useState(false);

    const categories = ["disinfectants", "equipment"];
    const { products, isPending, isError } = useGetProducts();
    const { productTypes } = useGetProductTypes();

    // Filtered products
    const filtered = useMemo(() => {
        return products?.filter(p =>
            (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
            (category === "all" || p.category === category) &&
            (!stomatologie || p.stomatologie) &&
            (!medicinaGenerala || p.medicina_generala) &&
            (subCategory === "all" || p.product_type.type_name === subCategory)
        );
    }, [products, search, category, stomatologie, medicinaGenerala, subCategory]);

    if (isPending) {
        return (
            <Loader />
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-40 text-red-500">
                Eroare la încărcarea produselor.
            </div>
        );
    }

    return (
        <div className="w-full border rounded p-3 bg-white dark:bg-neutral-900 text-black dark:text-white">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-4">
            <Input
                name='search'
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-xs"
            />

            {/* Category filter */}
            <Select
                name="category"
                value={category}
                onValueChange={setCategory}
                >
                <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">All categories</SelectItem>
                        <SelectItem value="disinfectants">Dezinfectanți</SelectItem>
                        <SelectItem value="equipment">Echipamente</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Sub-Category filter */}
            <Select
                name="sub-category"
                value={subCategory}
                onValueChange={setSubCategory}
                >
                <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="All sub-categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">All sub-categories</SelectItem>
                            <Separator key="separator-1" className="my-2" />   
                            {(productTypes ?? []).map((type, idx) => (
                                <React.Fragment key={type.product_type_id}>
                                    <SelectItem key={type.product_type_id} value={type.type_name}>
                                        {type.type_name}
                                    </SelectItem>
                                    {idx === 3 && (
                                        <Separator key={`separator-TypesFilter`} className="my-2" />   
                                    )}
                                </React.Fragment>
                            ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Checkboxes */}
            <div className="flex space-x-4">
                <div className="flex items-center gap-1">
                    <Checkbox
                        id="stomatologie"
                        checked={stomatologie}
                        onCheckedChange={checked => setStomatologie(checked === true)}
                        name="stomatologie"
                    />
                    <Label htmlFor="stomatologie">Stomatologie</Label>
                </div>
                <div className="flex items-center gap-1">
                    <Checkbox
                        id="medicina_generala"
                        checked={medicinaGenerala}
                        onCheckedChange={checked => setMedicinaGenerala(checked === true)}
                        name="medicina_generala"
                    />
                    <Label htmlFor="medicina_generala">Medicină generală</Label>
                </div>                
            </div>

            <div className="p-2 text-sm ml-auto">{filtered?.length} produse</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded border bg-white dark:bg-neutral-950">
            <table className="min-w-full text-sm">
            <thead>
                <tr className="border-b">
                <th className="p-3 text-left">Imagini</th>
                <th className="p-3 text-left">Titlu</th>
                <th className="p-3 text-left">Pret MDL</th>                                
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Sub-category</th>
                <th className="p-3 text-left">Domeniu</th>
                <th className="p-3 text-left">PDF</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-left">Updated</th>
                </tr>
            </thead>
            <tbody>
                {filtered?.map(product => (
                <tr
                    key={product.id}
                    className="hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition border-b"
                    onClick={() => setSelectedRow(product)}
                >
                    <td className="p-3">
                        <div className="flex gap-2 min-w-[120px]">
                            {(product.product_images ?? []).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.url || '/images/mediclean-logo.jpg'}
                                    alt={product.title}
                                    className="w-10 h-10 object-cover rounded"
                                />
                            ))}
                            {(product.product_images?.length ?? 0) === 0 && (
                                <img
                                    src="/images/mediclean-logo.jpg"
                                    alt={product.title}
                                    className="w-10 h-10 object-cover rounded"
                                />
                            )}
                        </div>
                    </td>
                    <td className="p-3 font-medium">{product.title}</td>
                    <td className="p-3 text-xs">
                        {product.price !== null
                            ? (
                                <Badge variant="tertiary">
                                    {product.price}
                                </Badge>
                            )
                            : (product.product_volumes_price.length > 0)
                                ? (
                                        <div className="flex flex-wrap gap-2 w-[200px]">
                                            {product.product_volumes_price.map((v, idx) => (
                                                // <span
                                                //     key={idx}
                                                //     className="w-fit border rounded px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800"
                                                // >
                                                //     {v.volume}= {v.price}
                                                // </span>
                                                <Badge variant="tertiary" key={idx}>
                                                    {v.volume} = {v.price}
                                                </Badge>
                                            ))}
                                        </div>
                                    )
                                : ""}
                    </td>
                    <td className="p-3">
                        <Badge variant="default" className="w-fit">
                            {product.category === 'equipment'
                                ? 'Echipament'
                                : product.category === 'disinfectants'
                                ? 'Dezinfectanti'
                                : product.category}
                        </Badge>
                    </td>
                    <td className="p-3">
                        <Badge variant="outline" className="max-w-[120px]">
                            {product.product_type?.type_name}
                        </Badge>
                    </td>
                    <td className="p-3 gap-1 w-fit">
                        {product.stomatologie && (
                            <Badge variant="primary">
                                Stomatologie
                            </Badge>
                        )}
                        {product.medicina_generala && (
                            <Badge variant="secondary">
                                M. generală
                            </Badge>
                        )}
                    </td>
                    <td className="p-3">
                        {product.doc_url
                            ? <CircleCheck />
                            : <Minus />
                        }
                    </td>
                    <td className="p-3 text-xs">
                        {product.created_at
                            ? new Date(product.created_at).toLocaleString("ro-RO")
                            : ""}
                    </td>
                    <td className="p-3 text-xs">
                        {product.updated_at
                            ? new Date(product.updated_at).toLocaleString("ro-RO")
                            : ""}
                    </td>
                </tr>
                ))}
                {filtered?.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-3 text-center text-gray-400">No products found.</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Side Panel */}
        <Sheet open={!!selectedRow} onOpenChange={open => !open && setSelectedRow(null)}>
            <SheetContent side="left" className="max-w-md w-full" aria-describedby={undefined}>
            <SheetHeader>
                <SheetTitle>Edit Product</SheetTitle>
            </SheetHeader>
            {selectedRow && (
                <form className="space-y-4 px-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <Input defaultValue={selectedRow.title} />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Price</label>
                    <Input type="number" defaultValue={selectedRow.price} />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select defaultValue={selectedRow.category} className="border rounded p-2 w-full bg-white dark:bg-neutral-950 text-black dark:text-white">
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat[0].toUpperCase() + cat.slice(1)}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea defaultValue={selectedRow.description ?? ""} className="border rounded p-2 w-full" rows={3} />
                </div>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={selectedRow.stomatologie} />
                    Stomatologie
                    </label>
                    <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={selectedRow.medicina_generala} />
                    Medicină generală
                    </label>
                </div>
                {/* You can add image/pdf upload/edit here */}
                <Button disabled={true} type="submit" className="w-full">Save Changes</Button>
                </form>
            )}
            </SheetContent>
        </Sheet>
        </div>
    );
}