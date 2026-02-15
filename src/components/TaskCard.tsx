
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Task } from '@/types/task';
import { getPriorityColor, getPriorityLabel, isTaskOverdue, formatDate } from '@/utils/taskUtils';
import { Calendar, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
    const isOverdue = isTaskOverdue(task);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            layout
        >
            <Card className={`p-4 task-card-hover ${task.completed ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onToggle(task.id)}
                        className="mt-1"
                        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3
                                className={`font-semibold text-lg ${task.completed ? 'line-through text-muted-foreground' : ''
                                    }`}
                            >
                                {task.title}
                            </h3>

                            {/* Actions */}
                            <div className="flex gap-1 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(task)}
                                    className="h-8 w-8"
                                    aria-label={`Edit "${task.title}"`}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(task.id)}
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    aria-label={`Delete "${task.title}"`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Description */}
                        {task.description && (
                            <p className={`text-sm mb-3 ${task.completed ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                                {task.description}
                            </p>
                        )}

                        {/* Tags and Priority */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getPriorityColor(task.priority)}>
                                {getPriorityLabel(task.priority)}
                            </Badge>

                            {task.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {/* Due Date */}
                        {task.dueDate && (
                            <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                                }`}>
                                {isOverdue && <AlertCircle className="h-4 w-4" />}
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(task.dueDate)}</span>
                                {isOverdue && <span className="ml-1">(Atrasada)</span>}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
