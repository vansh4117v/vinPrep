"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        console.log("Starting signup process for:", email);

        // Create user with Firebase Auth
        let userCredential;
        try {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
        } catch (authError: any) {
          console.error("Firebase Auth error:", authError);
          
          // Handle Firebase Auth specific errors
          if (authError.code === "auth/email-already-in-use") {
            toast.error("This email is already registered. Please sign in instead.");
            return;
          } else if (authError.code === "auth/weak-password") {
            toast.error("Password is too weak. Please choose a stronger password.");
            return;
          } else if (authError.code === "auth/invalid-email") {
            toast.error("Please enter a valid email address.");
            return;
          } else {
            toast.error(`Signup failed: ${authError.message}`);
            return;
          }
        }

        console.log("Firebase user created:", userCredential.user.uid);

        // Save user to Firestore via server action
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        console.log("Server signup result:", result);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        console.log("Starting signin process for:", email);

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        console.log("Got ID token, calling server signin");

        const signInResult = await signIn({
          email,
          idToken,
        });

        console.log("Server signin result:", signInResult);

        if (!signInResult.success) {
          toast.error(signInResult.message);
          return;
        }

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error(`An unexpected error occurred: ${error.message || error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[600px] max-w-md mx-auto">
      <div className="flex flex-col gap-8 card py-16 px-12">
        {/* VinPrep Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-md opacity-60"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl">
                <Image
                  src="/logo.svg"
                  alt="VinPrep"
                  height={32}
                  width={38}
                  className="filter brightness-0 invert"
                />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              VinPrep
            </h2>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              {isSignIn ? "Welcome Back!" : "Join VinPrep"}
            </h3>
            <p className="text-purple-200/80">
              {isSignIn
                ? "Continue your interview mastery journey"
                : "Start practicing interviews with AI-powered feedback"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="your.email@example.com"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Create a secure password"
              type="password"
            />

            <Button className="btn" type="submit">
              <span className="flex items-center gap-2">
                {isSignIn ? (
                  <>
                    <span>🚀</span>
                    <span>Sign In to VinPrep</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Create Your Account</span>
                  </>
                )}
              </span>
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-slate-300">
            {isSignIn ? "New to VinPrep?" : "Already have an account?"}
          </p>
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-cyan-300 transition-all duration-300 text-lg"
          >
            {!isSignIn ? "Sign In Here" : "Create Account"}
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-purple-500/20">
          <div className="text-center space-y-1">
            <div className="text-2xl">🤖</div>
            <p className="text-xs text-purple-200/80">AI-Powered</p>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl">📊</div>
            <p className="text-xs text-purple-200/80">Real-time Feedback</p>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl">🎯</div>
            <p className="text-xs text-purple-200/80">Skill Mastery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
