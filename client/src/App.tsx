import { Switch, Route } from "wouter";
import { AppProvider } from "@/lib/store";
import Today from "@/pages/Today";
import CalendarPage from "@/pages/Calendar";
import EditRoutinePage from "@/pages/EditRoutine";
import StatsPage from "@/pages/Stats";
import SettingsPage from "@/pages/Settings";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Today} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/edit" component={EditRoutinePage} />
      <Route path="/stats" component={StatsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppProvider>
      <Toaster />
      <Router />
    </AppProvider>
  );
}

export default App;
