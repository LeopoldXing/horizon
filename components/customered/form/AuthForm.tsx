"use client";

import React, {useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Loader2} from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "password needs to be at least 8 characters")
      .max(20, "password can not exceed 20 characters"),
  /*.regex(/[a-z]/, "password must contain at least one letter")
  .regex(/[A-Z]/, "password must contain at least one capitalized letter")
  .regex(/[0-9]/, "password must contain at least one number")
  .regex(/[@I$!%*?&]/, "password must contain at least one special character"),*/
});

const AuthForm = ({type}: { type: string }) => {
  const [user, setUser] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Define the form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    console.log(values);

    setIsSubmitting(false);
  }

  return (
      <div className="w-full max-w-[420px] min-h-screen py-10 flex flex-col justify-center gap-5 md:gap-8">
        <header className="flex flex-col gap-5 md:gap-8">
          <Link href="/" className="flex items-center gap-1 cursor-pointer">
            <Image src="/icons/logo.svg" alt="Horizon Logo" width={34} height={34}/>
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
          </Link>
          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 text-gray-900 font-semibold">
              {user ? "Link Account" : (type === "sign-in" ? "Sign In" : "Sign Up")}
              <p className="text-16 text-gray-600 font-normal">
                {user ? "Link your account to get started" : "Please enter your details"}
              </p>
            </h1>
          </div>
        </header>
        {user ? (
            <div className="flex flex-col gap-4">
              {/*  PlaidLink  */}
            </div>
        ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/*  email  */}
                  <FormField control={form.control} name="email" render={({field}) => (
                      <div className="flex flex-col gap-1.5">
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="w-full flex flex-col">
                            <FormControl>
                              <Input placeholder="Enter your email" {...field}
                                     className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                            </FormControl>
                            <FormMessage className="mt-2 text-12 text-red-500"/>
                          </div>
                        </FormItem>
                      </div>
                  )}/>
                  {/*  password  */}
                  <FormField control={form.control} name="password" render={({field}) => (
                      <div className="flex flex-col gap-1.5">
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="w-full flex flex-col">
                            <FormControl>
                              <Input placeholder="Enter your password" {...field}
                                     className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                            </FormControl>
                            <FormMessage className="mt-2 text-12 text-red-500"/>
                          </div>
                        </FormItem>
                      </div>
                  )}/>
                  <div className="flex flex-col gap-4">
                    <Button type="submit" disabled={isSubmitting}
                            className="text-16 text-white font-semibold rounded-lg border border-bankGradient bg-bank-gradient shadow-form">
                      {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="animate-spin"/> &nbsp; Loading
                          </>
                      ) : (
                          type === "sign-in" ? "Sign In" : "Sign Up"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
              <footer className="flex justify-center gap-1">
                <p className="text-14 text-gray-600 font-normal">
                  {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                      className="text-14 text-bankGradient font-medium cursor-pointer">{type === "sign-in" ? "Sign In" : "Sign Up"}</Link>
              </footer>
            </>
        )}
      </div>
  );
};

export default AuthForm;
