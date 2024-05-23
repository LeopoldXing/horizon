"use server";

import {createAdminClient, createSessionClient} from "@/lib/appwrite";
import {cookies} from "next/headers";
import {ID, Models} from "node-appwrite";

/**
 * handle sign in
 * @param data
 */
const signIn = async (data: SignInProps): Promise<Models.Session> => {
  const {email, password} = data;

  let response = null;
  try {
    const {account} = await createAdminClient();
    response = await account.createEmailPasswordSession(email, password);
  } catch (err) {
    console.error("Error logging in signing in", err);
  }

  return JSON.parse(JSON.stringify(response));
}

/**
 * handle sign up
 * @param data
 */
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
