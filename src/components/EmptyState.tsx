
import { motion } from 'framer-motion';
import { CheckCircle2, ListTodo } from 'lucide-react';

interface EmptyStateProps {
    hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            {hasFilters ? (
                <>
                    <div className="rounded-full bg-muted p-6 mb-4">
                        <ListTodo className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Nenhuma tarefa encontrada</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Não há tarefas que correspondam aos seus filtros atuais. Tente ajustar os filtros ou criar uma nova tarefa.
                    </p>
                </>
            ) : (
                <>
                    <div className="rounded-full bg-primary/10 p-6 mb-4">
                        <CheckCircle2 className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Comece a organizar suas tarefas!</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Você ainda não tem nenhuma tarefa. Clique no botão "+" para criar sua primeira tarefa e começar a ser mais produtivo.
                    </p>
                </>
            )}
        </motion.div>
    );
}
