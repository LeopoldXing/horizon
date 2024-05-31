"use server";

import {cookies} from "next/headers";

const BASE_URL = process.env.BASE_URL!.endsWith("/")
    ? process.env.BASE_URL!.slice(0, process.env.BASE_URL!.length)
    : process.env.BASE_URL;

/**
 * get user info by token
 */
export const getUserInfo = async (): Promise<any> => {
  let res = null;
  if(!cookies().has("horizon-token")){
    return null;
  }
  const token = cookies().get("horizon-token")!.value;
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      body: JSON.stringify({token: token}),
      next: {revalidate: 1}
    });
    if (response.ok) {
      res = await response.json();
    }
  } catch (err) {
    console.error(err);
  }
  return JSON.parse(JSON.stringify(res));
}

/**
 * user sign-in
 * @param email
 * @param password
 */
export const signIn = async (email: string, password: string): Promise<any> => {
  let user;
  try {
    const response = await fetch(`${BASE_URL}/user/sign-in`, {
      method: "POST",
      body: JSON.stringify({email, password: password}),
      next: {revalidate: 5}
    });
    if (response.ok) {
      const res = await response.json();
      const data = res.data;
      user = data.user;
      cookies().set("horizon-token", data.token, {path: "/", httpOnly: true, sameSite: "strict", secure: true});
    }
  } catch (err) {
    console.error(err);
  }
  return JSON.parse(JSON.stringify(user));
}

/**
 * user logout
 * @param userId
 */
export const signOut = async (userId: string): Promise<any> => {
  let res = false;
  try {
    const response = await fetch(`${BASE_URL}/user/sign-out`, {
      method: "POST",
      body: JSON.stringify({userId: userId})
    });
    if (response.ok) {
      res = true;
      cookies().delete("horizon-token");
    }
  } catch (err) {
    console.error("Error logging out signing out", err);
  }

  return res;
}

/**
 * sign-up
 * @param data
 */
export const signUp = async (data: {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  password: string;
}): Promise<any> => {
  const {
    email,
    password,
    firstName,
    lastName,
    address,
    city,
    postalCode,
    dateOfBirth,
    ssn,
    state
  } = data;
  let newUser;
  try {
    const response = await fetch(`${BASE_URL}/user/sign-up`, {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        state: state,
        postalCode: postalCode,
        dateOfBirth: dateOfBirth,
        ssn: ssn,
        email: email,
        password: password
      }),
      cache: "no-cache"
    });
    if (response.ok) {
      const res = await response.json();
      const data = res.data;
      newUser = data.user;
    }
  } catch (err) {
    console.error("Error logging in signing up", err);
  }

  return JSON.parse(JSON.stringify(newUser));
}

const getLoggedInUser = async (): Promise<User> => {
  let res = null;
  try {
    res = await getUserInfo();
  } catch (error) {
    console.error(error);
  }
  return JSON.parse(JSON.stringify(res));
}

export {getLoggedInUser};
