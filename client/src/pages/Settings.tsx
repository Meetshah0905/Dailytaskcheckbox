import React from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/lib/store';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, RefreshCw, Download, Upload, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetRoutine, routine, logs } = useApp();
  const { toast } = useToast();

  const handleExport = () => {
    const data = { routine, logs, settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routine-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Backup file downloaded." });
  };

  return (
    <Layout>
       <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your experience.</p>
      </div>

      <div className="px-4 space-y-6">
        
        {/* Preferences */}
        <div className="glass-card rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Preferences</h3>
          
          <div className="flex items-center justify-between">
             <div className="space-y-0.5">
               <div className="font-medium">Streak Freeze</div>
               <div className="text-xs text-muted-foreground">Allow 1 missed day per week</div>
             </div>
             <Switch 
               checked={settings.streakFreezeEnabled} 
               onCheckedChange={(c) => updateSettings({ streakFreezeEnabled: c })} 
             />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between">
                <div className="font-medium">Completion Threshold</div>
                <span className="font-mono text-sm">{settings.completionThreshold}%</span>
             </div>
             <Slider 
               value={[settings.completionThreshold]} 
               max={100} 
               step={5} 
               onValueChange={(v) => updateSettings({ completionThreshold: v[0] })}
             />
             <div className="text-xs text-muted-foreground">
               Minimum tasks required to keep streak if not all "Must Do" are done.
             </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
           <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Data</h3>
           
           <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl border-white/10 bg-transparent hover:bg-white/5" onClick={handleExport}>
             <Download size={18} /> Export Data
           </Button>

           <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl border-white/10 bg-transparent hover:bg-white/5" disabled>
             <Upload size={18} /> Import Data (Coming Soon)
           </Button>

           <div className="pt-4">
             <Button variant="destructive" className="w-full justify-start gap-3 h-12 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" onClick={() => {
               if(confirm("Reset routine to default? This cannot be undone.")) resetRoutine();
             }}>
               <RefreshCw size={18} /> Reset Routine to Default
             </Button>
           </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pb-8">
          v1.0.0 • Offline First • No Cloud Sync
        </div>

      </div>
    </Layout>
  );
}
