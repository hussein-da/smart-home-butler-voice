
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Settings, Menu, Cpu, Lightbulb, PanelLeftOpen } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup } from '@/components/ui/sidebar';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Link, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <ThemeProvider defaultTheme="light" attribute="class" storageKey="butler-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar>
            <SidebarHeader className="flex items-center py-4">
              <div className="flex items-center space-x-2 px-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Home className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">SmartHome Butler</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <div className="space-y-1 px-3 py-2">
                  <Link to="/">
                    <Button 
                      variant={location.pathname === '/' ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/devices">
                    <Button 
                      variant={location.pathname === '/devices' ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                    >
                      <Cpu className="mr-2 h-4 w-4" />
                      Geräteverwaltung
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Automatisierung
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Settings className="mr-2 h-4 w-4" />
                    Einstellungen
                  </Button>
                </div>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="px-3 py-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-muted-foreground">© 2025 Butler</span>
                  <div className="flex-shrink-0">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 flex flex-col min-h-screen">
            <header className="border-b shadow-sm p-4 bg-background sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <SidebarTrigger>
                    <PanelLeftOpen className="h-5 w-5" />
                  </SidebarTrigger>
                  <h1 className="ml-4 text-lg font-semibold md:text-xl">
                    {location.pathname === '/' && 'Smart Home Dashboard'}
                    {location.pathname === '/devices' && 'Geräteverwaltung'}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <main className="flex-1 w-full p-4 md:p-6 overflow-auto">
              {children}
            </main>

            <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
              SmartHome Butler • Demo Projekt • {new Date().getFullYear()}
            </footer>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
