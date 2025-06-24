import AddProductForm from '@/components/admin/AddProductForm';
import ProductTable from '@/components/admin/ProductTable';
import React from 'react';

export default async function Admin() {

    return (
        <div className="my-4">
            <div className="grid grid-cols-1 md:grid-cols-[73%_1fr] gap-4">
                <div className="order-2 md:order-1">
                    <ProductTable />
                </div>
                <div className="order-1 md:order-2">
                    <AddProductForm />
                </div>
            </div>
        </div>
    );
}
