import { Task, TaskFilters, TaskSort, Priority } from '@/types/task';
import { isAfter, isBefore, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// Filter tasks based on filter criteria
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
    return tasks.filter(task => {
        // Status filter
        if (filters.status === 'active' && task.completed) return false;
        if (filters.status === 'completed' && !task.completed) return false;

        // Priority filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

        // Tags filter
        if (filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some(tag => task.tags.includes(tag));
            if (!hasMatchingTag) return false;
        }

        // Search query filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const matchesTitle = task.title.toLowerCase().includes(query);
            const matchesDescription = task.description.toLowerCase().includes(query);
            const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(query));

            if (!matchesTitle && !matchesDescription && !matchesTags) return false;
        }

        // Date range filter
        if (filters.dateRange.start || filters.dateRange.end) {
            if (!task.dueDate) return false;

            const taskDate = startOfDay(task.dueDate);

            if (filters.dateRange.start && filters.dateRange.end) {
                const start = startOfDay(filters.dateRange.start);
                const end = endOfDay(filters.dateRange.end);
                if (!isWithinInterval(taskDate, { start, end })) return false;
            } else if (filters.dateRange.start) {
                const start = startOfDay(filters.dateRange.start);
                if (isBefore(taskDate, start)) return false;
            } else if (filters.dateRange.end) {
                const end = endOfDay(filters.dateRange.end);
                if (isAfter(taskDate, end)) return false;
            }
        }

        return true;
    });
}

// Sort tasks based on sort criteria
export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
    const sorted = [...tasks];

    sorted.sort((a, b) => {
        let comparison = 0;

        switch (sort.by) {
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;

            case 'createdAt':
                comparison = a.createdAt.getTime() - b.createdAt.getTime();
                break;

            case 'dueDate':
                // Tasks without due dates go to the end
                if (!a.dueDate && !b.dueDate) comparison = 0;
                else if (!a.dueDate) comparison = 1;
                else if (!b.dueDate) comparison = -1;
                else comparison = a.dueDate.getTime() - b.dueDate.getTime();
                break;

            case 'priority':
                const priorityOrder = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
                comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
                break;
        }

        return sort.order === 'asc' ? comparison : -comparison;
    });

    return sorted;
}

// Get priority color classes
export function getPriorityColor(priority: Priority): string {
    switch (priority) {
        case Priority.HIGH:
            return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
        case Priority.MEDIUM:
            return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
        case Priority.LOW:
            return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    }
}

// Get priority label
export function getPriorityLabel(priority: Priority): string {
    switch (priority) {
        case Priority.HIGH:
            return 'Alta';
        case Priority.MEDIUM:
            return 'Média';
        case Priority.LOW:
            return 'Baixa';
    }
}

// Check if task is overdue
export function isTaskOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return isBefore(task.dueDate, new Date());
}

// Format date for display
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
}
