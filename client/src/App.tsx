import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/pages/dashboard";
import ServersPage from "@/pages/servers";
import CommandsPage from "@/pages/commands";
import LogsPage from "@/pages/logs";
import SettingsPage from "@/pages/settings";
import TermsOfServicePage from "@/pages/terms-of-service";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: {
      duration: 0.15,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

function ProtectedRouter() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="h-full"
      >
        <Switch location={location}>
          <Route path="/" component={Dashboard} />
          <Route path="/servers" component={ServersPage} />
          <Route path="/commands" component={CommandsPage} />
          <Route path="/logs" component={LogsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/terms" component={TermsOfServicePage} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [location] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      setIsAuthenticated(response.ok);
    } catch {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
          data-testid="text-loading"
        >
          Carregando...
        </motion.div>
      </div>
    );
  }

  const isLoginPage = location === "/login";

  if (!isAuthenticated && !isLoginPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoginPage />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (isLoginPage && isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  if (isLoginPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoginPage />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
              </header>
              <main className="flex-1 overflow-auto">
                <ProtectedRouter />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
