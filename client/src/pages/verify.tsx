import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { auth } from "@/lib/firebase";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Verify() {
  const [, setLocation] = useLocation();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already verified
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.emailVerified) {
        setLocation("/chat");
      } else if (!user) {
        setLocation("/");
      }
    });

    return () => unsubscribe();
  }, [setLocation]);

  const handleVerify = async () => {
    if (!value || value.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a valid 6-digit code"
      });
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user found");
      }

      // Here we'll simulate verification since we can't actually verify the code
      // In a real app, this would verify the code with Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));

      await user.reload();
      if (user.emailVerified) {
        toast({
          title: "Verification successful",
          description: "Redirecting to chat..."
        });
        setLocation("/chat");
      } else {
        throw new Error("Verification failed");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-lg border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              <motion.span 
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                animate={{ 
                  textShadow: [
                    "0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa",
                    "0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #f0f"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                Enter Verification Code
              </motion.span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <InputOTP
                value={value}
                onChange={(val) => setValue(val)}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup className="gap-2">
                    {slots.map((slot, idx) => (
                      <InputOTPSlot
                        key={idx}
                        {...slot}
                        className="w-10 h-12 text-center border-2 border-purple-500/30 bg-black/50 text-purple-400 focus:border-purple-500"
                      />
                    ))}
                  </InputOTPGroup>
                )}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full"
              >
                <Button
                  onClick={handleVerify}
                  disabled={isLoading || value.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}