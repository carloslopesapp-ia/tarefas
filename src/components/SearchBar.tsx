import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebouncedCallback } from '@/hooks/useDebounce';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Pesquisar tarefas..." }: SearchBarProps) {
    const [value, setValue] = useState('');

    const debouncedSearch = useDebouncedCallback((query: string) => {
        onSearch(query);
    }, 300);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedSearch(newValue);
    }, [debouncedSearch]);

    const handleClear = useCallback(() => {
        setValue('');
        onSearch('');
    }, [onSearch]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="pl-9 pr-9"
                aria-label="Pesquisar tarefas"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={handleClear}
                    aria-label="Limpar pesquisa"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
