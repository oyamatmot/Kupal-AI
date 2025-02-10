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
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOutUser();
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
      >
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full" disabled={isLoading}>
          <Avatar className="h-8 w-8">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full rounded-full" />
            ) : (
              <div className="bg-purple-600 h-full w-full rounded-full flex items-center justify-center text-white">
                {user.displayName?.[0] || 'U'}
              </div>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignIn} disabled={isLoading}>
          Change account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}