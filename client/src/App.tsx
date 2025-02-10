import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Chat from "@/pages/chat";
import Welcome from "@/pages/welcome";
import Verify from "@/pages/verify";
import NotFound from "@/pages/not-found";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      if (!user || !user.emailVerified) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: user ? "Please verify your email first" : "Please sign in to access this page",
        });
        setLocation(user ? "/verify" : "/");
      }
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, [setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-purple-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!auth.currentUser?.emailVerified) {
    return null;
  }

  return <Component />;
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Global auth state changed:", user ? "User logged in" : "No user");
      console.log("Current location:", location);

      if (user) {
        if (user.emailVerified && location === "/") {
          window.location.href = "/chat";
        } else if (!user.emailVerified && !location.includes("/verify")) {
          window.location.href = "/verify";
        }
      }
    });

    return () => unsubscribe();
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/verify" component={Verify} />
      <Route path="/chat">
        <ProtectedRoute component={Chat} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;