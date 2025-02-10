import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { auth, signInWithGoogle } from "@/lib/firebase";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLocation('/chat');
      }
    });
    return () => unsubscribe();
  }, [setLocation]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1 
          className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          animate={{ 
            textShadow: [
              "0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa",
              "0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #f0f, 0 0 82px #f0f, 0 0 92px #f0f, 0 0 102px #f0f, 0 0 151px #f0f"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          Kupal-AI
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your Intelligent Chat Companion
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.8 }}
        >
          <Button 
            onClick={handleSignIn}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg font-semibold shadow-[0_0_15px_rgba(123,97,255,0.5)] hover:shadow-[0_0_25px_rgba(123,97,255,0.7)] transition-all duration-300"
          >
            Sign in with Google
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}