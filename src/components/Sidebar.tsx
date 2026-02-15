
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Priority, FilterStatus, SortBy, SortOrder } from '@/types/task';
import { Filter, X, ArrowUpDown } from 'lucide-react';

interface SidebarProps {
    statusFilter: FilterStatus;
    priorityFilter: Priority | 'all';
    tagsFilter: string[];
    availableTags: string[];
    sortBy: SortBy;
    sortOrder: SortOrder;
    onStatusChange: (status: FilterStatus) => void;
    onPriorityChange: (priority: Priority | 'all') => void;
    onTagsChange: (tags: string[]) => void;
    onSortChange: (by: SortBy, order: SortOrder) => void;
    onClearFilters: () => void;
}

export function Sidebar({
    statusFilter,
    priorityFilter,
    tagsFilter,
    availableTags,
    sortBy,
    sortOrder,
    onStatusChange,
    onPriorityChange,
    onTagsChange,
    onSortChange,
    onClearFilters,
}: SidebarProps) {
    const hasActiveFilters =
        statusFilter !== 'all' ||
        priorityFilter !== 'all' ||
        tagsFilter.length > 0;

    const toggleTag = (tag: string) => {
        if (tagsFilter.includes(tag)) {
            onTagsChange(tagsFilter.filter(t => t !== tag));
        } else {
            onTagsChange([...tagsFilter, tag]);
        }
    };

    const toggleSortOrder = () => {
        onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-80 shrink-0 hidden lg:block"
        >
            <Card className="p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Filtros</h2>
                    </div>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="h-8 text-xs"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Limpar
                        </Button>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Status Filter */}
                    <div className="space-y-2">
                        <Label>Estado</Label>
                        <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as FilterStatus)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="active">Ativas</SelectItem>
                                <SelectItem value="completed">Concluídas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Priority Filter */}
                    <div className="space-y-2">
                        <Label>Prioridade</Label>
                        <Select value={priorityFilter} onValueChange={(value) => onPriorityChange(value as Priority | 'all')}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value={Priority.HIGH}>Alta</SelectItem>
                                <SelectItem value={Priority.MEDIUM}>Média</SelectItem>
                                <SelectItem value={Priority.LOW}>Baixa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort */}
                    <div className="space-y-2">
                        <Label>Ordenar por</Label>
                        <div className="flex gap-2">
                            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortBy, sortOrder)}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt">Data de Criação</SelectItem>
                                    <SelectItem value="dueDate">Data de Vencimento</SelectItem>
                                    <SelectItem value="priority">Prioridade</SelectItem>
                                    <SelectItem value="title">Título</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleSortOrder}
                                className="shrink-0"
                                aria-label={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
                            >
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
                        </p>
                    </div>

                    {/* Tags Filter */}
                    {availableTags.length > 0 && (
                        <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant={tagsFilter.includes(tag) ? 'default' : 'outline'}
                                        className="cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => toggleTag(tag)}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </motion.aside>
    );
}
