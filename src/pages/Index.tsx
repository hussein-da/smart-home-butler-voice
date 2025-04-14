
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import { DeviceProvider } from '@/store/DeviceStore';

const Index = () => {
  return (
    <DeviceProvider>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </DeviceProvider>
  );
};

export default Index;
