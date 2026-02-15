
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
    onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50"
        >
            <Button
                size="lg"
                className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                onClick={onClick}
                aria-label="Adicionar nova tarefa"
            >
                <Plus className="h-6 w-6" />
            </Button>
        </motion.div>
    );
}
