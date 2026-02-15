import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { ProgressTracker } from '@/components/ProgressTracker';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Moon, Sun, ListTodo } from 'lucide-react';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    tasks,
    filters,
    sort,
    stats,
    availableTags,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setTagsFilter,
    updateSort,
    resetFilters,
  } = useTasks();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Handle task form submission
  const handleTaskSubmit = (data: any) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setEditingTask(null);
  };

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Handle delete task
  const handleDeleteTask = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(id);
    }
  };

  // Handle new task
  const handleNewTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  // Check if filters are active
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.tags.length > 0 ||
    filters.searchQuery !== '';

  return (
    <div className="min-h-screen bg-mesh animate-gradient">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Lista de Tarefas
                </h1>
                <p className="text-sm text-muted-foreground">Organize sua produtividade</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Alternar tema"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <Sidebar
            statusFilter={filters.status}
            priorityFilter={filters.priority}
            tagsFilter={filters.tags}
            availableTags={availableTags}
            sortBy={sort.by}
            sortOrder={sort.order}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onTagsChange={setTagsFilter}
            onSortChange={(by) => updateSort({ by })}
            onClearFilters={resetFilters}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Progress Tracker */}
            <ProgressTracker
              total={stats.total}
              completed={stats.completed}
              active={stats.active}
              completionRate={stats.completionRate}
            />

            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Pesquisar tarefas..."
              />
            </div>

            {/* Task List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <EmptyState hasFilters={hasActiveFilters} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleNewTask} />

      {/* Task Form Dialog */}
      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleTaskSubmit}
        task={editingTask}
      />
    </div>
  );
}

export default App;