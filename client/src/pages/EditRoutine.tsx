import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/lib/store';
import { RoutineBlock, Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, GripVertical, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function EditRoutinePage() {
  const { routine, setRoutine } = useApp();
  const { toast } = useToast();
  const [editingBlock, setEditingBlock] = useState<RoutineBlock | null>(null);

  const handleSaveBlock = (updatedBlock: RoutineBlock) => {
    setRoutine(routine.map(b => b.id === updatedBlock.id ? updatedBlock : b));
    setEditingBlock(null);
    toast({ title: "Saved", description: "Block updated successfully." });
  };

  return (
    <Layout>
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Routine</h1>
        <p className="text-muted-foreground">Customize your daily flow.</p>
      </div>

      <div className="px-4 pb-20 space-y-3">
        {routine.map((block, index) => (
          <div 
            key={block.id} 
            className="glass-card rounded-2xl p-4 flex items-center gap-4 group active:scale-[0.99] transition-transform"
            onClick={() => setEditingBlock(block)}
          >
            <div className="text-muted-foreground font-mono text-xs w-6 text-center">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">{block.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock size={12} /> {block.startTime} - {block.endTime}
                <span className="w-1 h-1 rounded-full bg-white/20" />
                {block.tasks.length} tasks
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <GripVertical size={20} />
            </Button>
          </div>
        ))}
        
        <Button className="w-full h-14 rounded-2xl border-dashed border-2 border-white/10 bg-transparent hover:bg-white/5 text-muted-foreground gap-2 font-bold mt-4">
          <Plus /> Add New Block (Coming Soon)
        </Button>
      </div>

      {/* Edit Block Sheet */}
      <Sheet open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl border-t border-white/10 bg-[#1a1a1a] p-0 flex flex-col">
          {editingBlock && (
            <BlockEditor 
              block={editingBlock} 
              onSave={handleSaveBlock} 
              onCancel={() => setEditingBlock(null)} 
            />
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
}

function BlockEditor({ block, onSave, onCancel }: { block: RoutineBlock, onSave: (b: RoutineBlock) => void, onCancel: () => void }) {
  const [name, setName] = useState(block.name);
  const [startTime, setStartTime] = useState(block.startTime);
  const [endTime, setEndTime] = useState(block.endTime);
  const [tasks, setTasks] = useState<Task[]>(block.tasks);

  const handleTaskChange = (id: string, field: keyof Task, value: any) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      mustDo: false,
      order: tasks.length
    };
    setTasks([...tasks, newTask]);
  };

  const handleSave = () => {
    onSave({
      ...block,
      name,
      startTime,
      endTime,
      tasks: tasks.filter(t => t.title.trim() !== "") // Filter empty
    });
  };

  return (
    <>
      <SheetHeader className="px-6 py-4 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
         <Button variant="ghost" onClick={onCancel} className="-ml-2 text-muted-foreground">Cancel</Button>
         <SheetTitle>Edit Block</SheetTitle>
         <Button onClick={handleSave} className="text-primary font-bold bg-transparent hover:bg-white/5">Save</Button>
      </SheetHeader>

      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-6 pb-20">
          
          {/* Block Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Block Name</Label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="bg-white/5 border-white/10 h-12 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input 
                  type="time" 
                  value={startTime} 
                  onChange={e => setStartTime(e.target.value)} 
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input 
                  type="time" 
                  value={endTime} 
                  onChange={e => setEndTime(e.target.value)} 
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            <Label className="text-muted-foreground uppercase tracking-wider text-xs font-bold">Tasks</Label>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={task.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                   <div className="mt-1">
                     <Switch 
                       checked={task.mustDo} 
                       onCheckedChange={(c) => handleTaskChange(task.id, 'mustDo', c)} 
                       className="scale-75 origin-left"
                     />
                   </div>
                   <Input 
                     value={task.title} 
                     onChange={e => handleTaskChange(task.id, 'title', e.target.value)}
                     placeholder="Task name"
                     className="flex-1 bg-transparent border-b border-white/10 rounded-none px-0 h-10 focus-visible:ring-0 focus-visible:border-primary"
                   />
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     onClick={() => handleDeleteTask(task.id)}
                     className="text-muted-foreground hover:text-destructive h-8 w-8"
                   >
                     <Trash2 size={16} />
                   </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={handleAddTask} className="w-full rounded-xl border-dashed border-white/20 hover:bg-white/5">
              + Add Task
            </Button>
          </div>

        </div>
      </ScrollArea>
    </>
  );
}
