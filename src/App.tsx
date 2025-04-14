
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DeviceProvider } from "./store/DeviceStore";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DeviceManagement from "./pages/DeviceManagement";

// Dummy Seiten für den Moment
const Automation = () => <div className="p-6"><h1 className="text-2xl font-bold">Automatisierungen</h1><p className="mt-4">Diese Seite wird bald verfügbar sein.</p></div>;
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold">Einstellungen</h1><p className="mt-4">Diese Seite wird bald verfügbar sein.</p></div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DeviceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/devices" element={<DeviceManagement />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DeviceProvider>
  </QueryClientProvider>
);

export default App;
