
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

interface ProgressTrackerProps {
    total: number;
    completed: number;
    active: number;
    completionRate: number;
}

export function ProgressTracker({ total, completed, active, completionRate }: ProgressTrackerProps) {
    return (
        <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Progresso</h2>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Conclusão</span>
                    <span className="text-sm font-semibold">{Math.round(completionRate)}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center mb-2">
                        <ListTodo className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{total}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center mb-2">
                        <Circle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold">{active}</div>
                    <div className="text-xs text-muted-foreground">Ativas</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{completed}</div>
                    <div className="text-xs text-muted-foreground">Concluídas</div>
                </motion.div>
            </div>
        </Card>
    );
}
