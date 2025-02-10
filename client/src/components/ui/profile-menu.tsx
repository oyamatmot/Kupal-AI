import { useEffect, useState } from "react";
import { Avatar } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { auth, signInWithGoogle, signOutUser } from "@/lib/firebase";
import { User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function ProfileMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "Failed to sign in with Google";

      if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Firebase configuration error. Please check if you've added the domain to authorized domains in Firebase console.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Pop-up was blocked by your browser. Please allow pop-ups for this site.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Sign-in was cancelled. Please try again.";
      }

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOutUser();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Button 
        variant="outline" 
        onClick={handleSignIn}
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
      >
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full relative" disabled={isLoading}>
          <Avatar className="h-8 w-8">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="h-full w-full rounded-full"
              />
            ) : (
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-full rounded-full flex items-center justify-center text-white">
                {user.displayName?.[0] || 'U'}
              </div>
            )}
          </Avatar>
          <div className="absolute inset-0 rounded-full ring-2 ring-purple-500/30 hover:ring-purple-500/50 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-black/90 border border-purple-500/30">
        <DropdownMenuItem 
          onClick={handleSignIn} 
          disabled={isLoading}
          className="hover:bg-purple-500/20"
        >
          Change account
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSignOut} 
          disabled={isLoading}
          className="hover:bg-purple-500/20"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}