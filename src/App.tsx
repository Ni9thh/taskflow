import { Dashboard } from '@/components/Dashboard';
import { Toaster } from '@/components/ui/toaster';
import { useTheme } from '@/hooks/useTheme';

function App() {
  useTheme(); // Initialize theme

  return (
    <div className="h-full w-full">
      <Dashboard />
      <Toaster />
    </div>
  );
}

export default App;
