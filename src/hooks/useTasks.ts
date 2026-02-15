import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData, TaskFilters, TaskSort, Priority, FilterStatus } from '@/types/task';
import { taskService } from '@/services/taskService';
import { filterTasks, sortTasks } from '@/utils/taskUtils';

const defaultFilters: TaskFilters = {
    status: 'all',
    priority: 'all',
    tags: [],
    searchQuery: '',
    dateRange: { start: null, end: null },
};

const defaultSort: TaskSort = {
    by: 'createdAt',
    order: 'desc',
};

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
    const [sort, setSort] = useState<TaskSort>(defaultSort);
    const [isLoading, setIsLoading] = useState(true);

    // Load tasks on mount
    const loadTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const [loadedTasks, loadedTags] = await Promise.all([
                taskService.getTasks(),
                taskService.getAllTags()
            ]);
            setTasks(loadedTasks);
            setAvailableTags(loadedTags);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    // Get filtered and sorted tasks
    const filteredTasks = filterTasks(tasks, filters);
    const sortedTasks = sortTasks(filteredTasks, sort);

    // Task operations
    const addTask = useCallback(async (taskData: TaskFormData) => {
        const newTask = await taskService.createTask({
            ...taskData,
            completed: false,
        });
        if (newTask) {
            setTasks(prev => [newTask, ...prev]);
            // Refresh tags if a new tag might have been added
            const tags = await taskService.getAllTags();
            setAvailableTags(tags);
        }
        return newTask;
    }, []);

    const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
        const updatedTask = await taskService.updateTask(id, updates);
        if (updatedTask) {
            setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
            // Refresh tags
            const tags = await taskService.getAllTags();
            setAvailableTags(tags);
        }
        return updatedTask;
    }, []);

    const deleteTask = useCallback(async (id: string) => {
        const success = await taskService.deleteTask(id);
        if (success) {
            setTasks(prev => prev.filter(task => task.id !== id));
            // Refresh tags
            const tags = await taskService.getAllTags();
            setAvailableTags(tags);
        }
        return success;
    }, []);

    const toggleTask = useCallback(async (id: string) => {
        const updatedTask = await taskService.toggleTask(id);
        if (updatedTask) {
            setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
        }
        return updatedTask;
    }, []);

    // Filter operations
    const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const setSearchQuery = useCallback((query: string) => {
        setFilters(prev => ({ ...prev, searchQuery: query }));
    }, []);

    const setStatusFilter = useCallback((status: FilterStatus) => {
        setFilters(prev => ({ ...prev, status }));
    }, []);

    const setPriorityFilter = useCallback((priority: Priority | 'all') => {
        setFilters(prev => ({ ...prev, priority }));
    }, []);

    const setTagsFilter = useCallback((tags: string[]) => {
        setFilters(prev => ({ ...prev, tags }));
    }, []);

    // Sort operations
    const updateSort = useCallback((newSort: Partial<TaskSort>) => {
        setSort(prev => ({ ...prev, ...newSort }));
    }, []);

    // Statistics
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        active: tasks.filter(t => !t.completed).length,
        completionRate: tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0,
    };

    return {
        // Data
        tasks: sortedTasks,
        allTasks: tasks,
        filters,
        sort,
        stats,
        availableTags,
        isLoading,

        // Task operations
        addTask,
        updateTask,
        deleteTask,
        toggleTask,

        // Filter operations
        updateFilters,
        resetFilters,
        setSearchQuery,
        setStatusFilter,
        setPriorityFilter,
        setTagsFilter,

        // Sort operations
        updateSort,
    };
}
