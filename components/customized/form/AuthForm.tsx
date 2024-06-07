"use client";

import React, {useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Loader2} from "lucide-react";
import {signIn, signUp} from "@/lib/actions/user.actions";
import {useRouter} from "next/navigation";
import PlaidLink from "@/components/customized/PlaidLink";

const AuthForm = ({type}: { type: string }) => {
  const [user, setUser] = useState<User>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  /*  form schema  */
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "password needs to be at least 8 characters")
        .max(20, "password can not exceed 20 characters")
        .regex(/[a-z]/, "password must contain at least one letter")
        .regex(/[A-Z]/, "password must contain at least one capitalized letter")
        .regex(/[0-9]/, "password must contain at least one number")
        .regex(/[@I$!%*?&]/, "password must contain at least one special character"),
    firstname: type === "sign-in" ? z.string().optional() : z.string(),
    lastname: type === "sign-in" ? z.string().optional() : z.string(),
    address: type === "sign-in" ? z.string().optional() : z.string().max(50, "address is too long"),
    city: type === "sign-in" ? z.string().optional() : z.string().max(30, "city name is too long"),
    state: type === "sign-in" ? z.string().optional() : z.string().max(2),
    postal: type === "sign-in" ? z.string().optional() : z.string(),
    dob: type === "sign-in" ? z.string().optional() : z.string(),
    ssn: type === "sign-in" ? z.string().optional() : z.string()
  });

  // 1. Define the form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      address: "",
      city: "",
      state: "",
      postal: "",
      dob: "",
      ssn: ""
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstname!,
          lastName: data.lastname!,
          address: data.address!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postal!,
          dateOfBirth: data.dob!,
          ssn: data.ssn!,
          email: data.email!,
          password: data.password!
        }
        const newUser = await signUp(userData);
        setUser(newUser);
      } else if (type === "sign-in") {
        const response = await signIn(data.email, data.password);
        if (response) router.push("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <PlaidLink user={user} variant="primary"/>
            </div>
        ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/*  sign-up attribute  */}
                  {type === "sign-up" && (
                      <>
                        <div className="flex flex-col sm:flex-row items-start justify-center sm:gap-4 gap-8">
                          {/*  First name  */}
                          <FormField control={form.control} name="firstname" render={({field}) => (

                              <div className="w-full flex flex-col gap-1.5">
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <div className="w-full flex flex-col">
                                    <FormControl>
                                      <Input placeholder="Enter your first name" {...field}
                                             className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                                    </FormControl>
                                    <FormMessage className="mt-2 text-12 text-red-500"/>
                                  </div>
                                </FormItem>
                              </div>
                          )}/>
                          {/*  Last name  */}
                          <FormField name="lastname" render={({field}) => (
                              <div className="w-full flex flex-col gap-1.5">
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <div className="w-full flex flex-col">
                                    <FormControl>
                                      <Input placeholder="Enter your last name" {...field}
                                             className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                                    </FormControl>
                                    <FormMessage className="mt-2 text-12 text-red-500"/>
                                  </div>
                                </FormItem>
                              </div>
                          )}/>
                        </div>
                        {/*  Address  */}
                        <FormField control={form.control} name="address" render={({field}) => (
                            <div className="w-full flex flex-col gap-1.5">
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <div className="w-full flex flex-col">
                                  <FormControl>
                                    <Input placeholder="Enter your first name" {...field}
                                           className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                                  </FormControl>
                                  <FormMessage className="mt-2 text-12 text-red-500"/>
                                </div>
                              </FormItem>
                            </div>
                        )}/>
                        {/*  City  */}
                        <FormField control={form.control} name="city" render={({field}) => (
                            <div className="w-full flex flex-col gap-1.5">
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <div className="w-full flex flex-col">
                                  <FormControl>
                                    <Input placeholder="Enter your city" {...field}
                                           className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                                  </FormControl>
                                  <FormMessage className="mt-2 text-12 text-red-500"/>
                                </div>
                              </FormItem>
                            </div>
                        )}/>
                        <div className="flex flex-col sm:flex-row items-start justify-center sm:gap-4 gap-8">
                          {/*  State  */}
                          <FormField control={form.control} name="state" render={({field}) => (

                              <div className="w-full flex flex-col gap-1.5">
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <div className="w-full flex flex-col">
                                    <FormControl>
                                      <Input placeholder="ex: NY" {...field}
                                             className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                                    </FormControl>
                                    <FormMessage className="mt-2 text-12 text-red-500"/>
                                  </div>
                                </FormItem>
                              </div>
                          )}/>
                          {/*  Postal Code  */}
                          <FormField name="postal" render={({field}) => (
                              <div className="w-full flex flex-col gap-1.5">
                                <FormItem>
                                  <FormLabel>Postal Code</FormLabel>
                                  <div className="w-full flex flex-col">
                                    <FormControl>
                                      <Input placeholder="ex: 11101" {...field}
                                             className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                                    </FormControl>
                                    <FormMessage className="mt-2 text-12 text-red-500"/>
                                  </div>
                                </FormItem>
                              </div>
                          )}/>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start justify-center sm:gap-4 gap-8">
                          {/*  Date of Birth  */}
                          <FormField control={form.control} name="dob" render={({field}) => (
                              <div className="w-full flex flex-col gap-1.5">
                                <FormItem>
                                  <FormLabel>Date of Birth</FormLabel>
                                  <div className="w-full flex flex-col">
                                    <FormControl>
                                      <Input placeholder="yyyy-mm-dd" {...field}
                                             className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                                    </FormControl>
                                    <FormMessage className="mt-2 text-12 text-red-500"/>
                                  </div>
                                </FormItem>
                              </div>
                          )}/>
                          {/*  SSN  */}
                          <FormField name="ssn" render={({field}) => (
                              <div className="w-full flex flex-col gap-1.5">
                                <FormItem>
                                  <FormLabel>SSN</FormLabel>
                                  <div className="w-full flex flex-col">
                                    <FormControl>
                                      <Input placeholder="ex: 1234" {...field}
                                             className="text-16 text-gray-900 placeholder:text-16 placeholder:text-gray-500 rounded-lg border border-gray-300"/>
                                    </FormControl>
                                    <FormMessage className="mt-2 text-12 text-red-500"/>
                                  </div>
                                </FormItem>
                              </div>
                          )}/>
                        </div>
                      </>
                  )}

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
                      className="text-14 text-bankGradient font-medium cursor-pointer">{type === "sign-in" ? "Sign Up" : "Sign In"}</Link>
              </footer>
            </>
        )}
      </div>
  );
};

export default AuthForm;
