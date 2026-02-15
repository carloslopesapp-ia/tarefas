import { supabase } from '@/lib/supabase';
import { Task, Priority } from '@/types/task';

export const taskService = {
    // Get all tasks from Supabase
    async getTasks(): Promise<Task[]> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description || '',
                completed: task.completed,
                priority: task.priority as Priority,
                tags: task.tags || [],
                dueDate: task.due_date ? new Date(task.due_date) : null,
                createdAt: new Date(task.created_at),
                updatedAt: new Date(task.updated_at),
            }));
        } catch (error) {
            console.error('Error loading tasks from Supabase:', error);
            return [];
        }
    },

    // Create a new task in Supabase
    async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | null> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    title: taskData.title,
                    description: taskData.description,
                    completed: taskData.completed,
                    priority: taskData.priority,
                    tags: taskData.tags,
                    due_date: taskData.dueDate?.toISOString(),
                }])
                .select()
                .single();

            if (error) throw error;

            return {
                id: data.id,
                title: data.title,
                description: data.description || '',
                completed: data.completed,
                priority: data.priority as Priority,
                tags: data.tags || [],
                dueDate: data.due_date ? new Date(data.due_date) : null,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
            };
        } catch (error) {
            console.error('Error creating task in Supabase:', error);
            return null;
        }
    },

    // Update an existing task in Supabase
    async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
        try {
            const supabaseUpdates: any = {};

            if (updates.title !== undefined) supabaseUpdates.title = updates.title;
            if (updates.description !== undefined) supabaseUpdates.description = updates.description;
            if (updates.completed !== undefined) supabaseUpdates.completed = updates.completed;
            if (updates.priority !== undefined) supabaseUpdates.priority = updates.priority;
            if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;
            if (updates.dueDate !== undefined) {
                supabaseUpdates.due_date = updates.dueDate ? updates.dueDate.toISOString() : null;
            }

            const { data, error } = await supabase
                .from('tasks')
                .update(supabaseUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return {
                id: data.id,
                title: data.title,
                description: data.description || '',
                completed: data.completed,
                priority: data.priority as Priority,
                tags: data.tags || [],
                dueDate: data.due_date ? new Date(data.due_date) : null,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
            };
        } catch (error) {
            console.error('Error updating task in Supabase:', error);
            return null;
        }
    },

    // Delete a task from Supabase
    async deleteTask(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting task from Supabase:', error);
            return false;
        }
    },

    // Toggle task completion
    async toggleTask(id: string): Promise<Task | null> {
        try {
            const { data: currentTask, error: fetchError } = await supabase
                .from('tasks')
                .select('completed')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            return this.updateTask(id, { completed: !currentTask.completed });
        } catch (error) {
            console.error('Error toggling task in Supabase:', error);
            return null;
        }
    },

    // Get all unique tags from Supabase
    async getAllTags(): Promise<string[]> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('tags');

            if (error) throw error;

            const tagsSet = new Set<string>();
            data.forEach((row: any) => {
                row.tags?.forEach((tag: string) => tagsSet.add(tag));
            });

            return Array.from(tagsSet).sort();
        } catch (error) {
            console.error('Error loading tags from Supabase:', error);
            return [];
        }
    },
};
