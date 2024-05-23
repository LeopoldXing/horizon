"use server";

import {createAdminClient, createSessionClient} from "@/lib/appwrite";
import {cookies} from "next/headers";
import {ID} from "node-appwrite";

const signIn = async (data: SignInProps): Promise<void> => {
  try {

  } catch (err) {
    console.error("Error logging in signing in", err);
  }
}

const signUp = async (data: SignUpProps): Promise<User> => {
  const {email, password, firstName, lastName} = data;
  let newUserAccount = null;

  try {
    const {account} = await createAdminClient();

    newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("horizon-session", session.secret, {path: "/", httpOnly: true, sameSite: "strict", secure: true});
  } catch (err) {
    console.error("Error logging in signing up", err);
  }

  return JSON.parse(JSON.stringify(newUserAccount));
}

const signOut = async (): Promise<void> => {
  try {

  } catch (err) {
    console.error("Error logging out signing out", err);
  }
}

const getLoggedInUser = async () => {
  try {
    const {account} = await createSessionClient();
    const user = await account.get();
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return null;
  }
}


export {signIn, signUp, signOut, getLoggedInUser};
