'use client';

import { Search, X } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface ProductSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    placeholder?: string;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
    searchQuery,
    onSearchChange,
    placeholder = "Caută produse..."
}) => {
    const clearSearch = () => {
        onSearchChange('');
    };

    return (
        <div className="relative w-full max-w-[330px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                className="pl-10 pr-10 bg-white"
            />
            {searchQuery && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="h-6 w-6 p-0 cursor-pointer"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    );
};
