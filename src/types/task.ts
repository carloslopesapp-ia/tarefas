export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    tags: string[];
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: Priority;
    tags: string[];
    dueDate: Date | null;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export interface TaskFilters {
    status: FilterStatus;
    priority: Priority | 'all';
    tags: string[];
    searchQuery: string;
    dateRange: {
        start: Date | null;
        end: Date | null;
    };
}

export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TaskSort {
    by: SortBy;
    order: SortOrder;
}
