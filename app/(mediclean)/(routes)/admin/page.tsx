import AddProductForm from '@/components/AddProductForm';
import React from 'react';

export default async function Admin() {
    return (
        <>
            <div className="text-3xl font-bold my-10">Adauga produs - test</div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <AddProductForm />
                <div>Text Text Text Text</div>
            </div>
            
        </>
    );
}
