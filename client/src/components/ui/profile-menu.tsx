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

export function ProfileMenu() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    signInWithGoogle().catch(console.error);
  };

  const handleSignOut = () => {
    signOutUser().catch(console.error);
  };

  if (!user) {
    return (
      <Button variant="outline" onClick={handleSignIn}>
        Sign in with Google
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full">
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
        <DropdownMenuItem onClick={handleSignIn}>Change account</DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}