import React, { useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskFormData, Priority } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: TaskFormData) => void;
    task?: Task | null;
}

export function TaskForm({ open, onOpenChange, onSubmit, task }: TaskFormProps) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState<Priority>(task?.priority || Priority.MEDIUM);
    const [tags, setTags] = useState<string[]>(task?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate || null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        // Add pending tag if exists
        let finalTags = [...tags];
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            finalTags.push(tagInput.trim());
        }

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            priority,
            tags: finalTags,
            dueDate,
        });

        onOpenChange(false);
    };

    const handleAddTagAction = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTagAction();
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // Reset form when dialog opens with a task
    React.useEffect(() => {
        if (open && task) {
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
            setTags(task.tags || []);
            setDueDate(task.dueDate);
        } else if (!open) {
            // Reset when closing
            setTitle('');
            setDescription('');
            setPriority(Priority.MEDIUM);
            setTags([]);
            setTagInput('');
            setDueDate(null);
        }
    }, [open, task]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
                    <DialogDescription>
                        {task ? 'Atualize os detalhes da sua tarefa.' : 'Adicione uma nova tarefa à sua lista.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Comprar mantimentos"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                placeholder="Adicione mais detalhes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Prioridade</Label>
                            <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                                <SelectTrigger id="priority">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={Priority.LOW}>Baixa</SelectItem>
                                    <SelectItem value={Priority.MEDIUM}>Média</SelectItem>
                                    <SelectItem value={Priority.HIGH}>Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Data de Vencimento</Label>
                            <div className="flex gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !dueDate && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dueDate && isValid(dueDate) ? (
                                                format(dueDate, 'PPP', { locale: ptBR })
                                            ) : (
                                                <span>Selecione uma data</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate || undefined}
                                            onSelect={(date) => setDueDate(date || null)}
                                            initialFocus
                                            locale={ptBR}
                                            fromYear={new Date().getFullYear()}
                                            toYear={new Date().getFullYear() + 10}
                                            captionLayout="dropdown"
                                        />
                                    </PopoverContent>
                                </Popover>
                                {dueDate && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setDueDate(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="tags"
                                    placeholder="Digite e pressione Enter"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddTagAction}
                                    disabled={!tagInput.trim()}
                                >
                                    Adicionar
                                </Button>
                            </div>
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!title.trim()}>
                            {task ? 'Atualizar' : 'Criar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
