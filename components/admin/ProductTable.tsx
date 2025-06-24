'use client';

import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductDetails } from "@/types";
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


export default function ProductTable() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string | "">("all");
    const [selected, setSelected] = useState<ProductDetails | null>(null);
    const [stomatologie, setStomatologie] = useState(false);
    const [medicinaGenerala, setMedicinaGenerala] = useState(false);

    const categories = ["disinfectants", "equipment"];
    const { products, isPending, isError } = useGetProducts();

    // Filtered products
    const filtered = useMemo(() => {
        return products?.filter(p =>
            (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
            (category === "all" || p.category === category) &&
            (!stomatologie || p.stomatologie) &&
            (!medicinaGenerala || p.medicina_generala)
        );
    }, [products, search, category, stomatologie, medicinaGenerala]);

    if (isPending) {
        return (
            <Loader />
        )
    }

    return (
        <div className="w-full border rounded p-3 bg-white dark:bg-neutral-900 text-black dark:text-white">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-4">
            <Input
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
                required
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
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>                                
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Sub-category</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-left">Updated</th>
                </tr>
            </thead>
            <tbody>
                {filtered?.map(product => (
                <tr
                    key={product.id}
                    className="hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition border-b"
                    onClick={() => setSelected(product)}
                >
                    <td className="p-3">
                    <img
                        src={product.image || '/images/mediclean-logo.jpg'}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                    />
                    </td>
                    <td className="p-3 font-medium">{product.title}</td>
                    <td className="p-3">{product.price}</td>
                    <td className="p-3">
                        <Badge variant="default" className="w-fit">
                            {product.category === 'equipment'
                                ? 'Echipament'
                                : product.category === 'disinfectants'
                                ? 'Dezinfectanti'
                                : product.category}
                        </Badge>
                    </td>
                    <td className="p-3 flex flex-col gap-1 w-fit">
                        {product.stomatologie && (
                            <Badge variant="primary">
                                Stomatologie
                            </Badge>
                        )}
                        {product.medicina_generala && (
                            <Badge variant="primary">
                                Medicina generală
                            </Badge>
                        )}
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
        <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
            <SheetContent side="left" className="max-w-md w-full" aria-describedby={undefined}>
            <SheetHeader>
                <SheetTitle>Edit Product</SheetTitle>
            </SheetHeader>
            {selected && (
                <form className="space-y-4 px-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <Input defaultValue={selected.title} />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Price</label>
                    <Input type="number" defaultValue={selected.price} />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select defaultValue={selected.category} className="border rounded p-2 w-full bg-white dark:bg-neutral-950 text-black dark:text-white">
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat[0].toUpperCase() + cat.slice(1)}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea defaultValue={selected.description ?? ""} className="border rounded p-2 w-full" rows={3} />
                </div>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={selected.stomatologie} />
                    Stomatologie
                    </label>
                    <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={selected.medicina_generala} />
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