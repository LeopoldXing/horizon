"use server";

import {cookies} from "next/headers";

const BASE_URL = process.env.BASE_URL;

/**
 * get user info by token
 */
export const getUserInfo = async (): Promise<any> => {
  let res = null;
  if (!cookies().has("horizon-token")) {
    return "";
  }
  const token = cookies().get("horizon-token")!.value;
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8"
      },
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
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
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
export const signOut = async (): Promise<any> => {
  let res = false;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/user/sign-out`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
        }
      });
      if (response.ok) {
        res = true;
        cookies().delete("horizon-token");
      }
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
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
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
    if (response) {
      const res = await response.json();
      newUser = res.data;
      cookies().set("horizon-token", res.data.token, {path: "/", httpOnly: true, sameSite: "strict", secure: true});
    }
  } catch (err) {
    console.error("Error logging in signing up", err);
  }

  return JSON.parse(JSON.stringify(newUser));
}

const getLoggedInUser = async (): Promise<User> => {
  let res = null;
  try {
    const response = await getUserInfo();
    if (response && response.statusCode == 200) {
      res = response.data;
    }
  } catch (error) {
    console.error(error);
  }
  return JSON.parse(JSON.stringify(res));
}

const initializeAccount = async () => {
  try {
    const token = cookies().get("horizon-token")!.value;
    const response = await fetch(`${BASE_URL}/user/init`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-cache"
    });
    console.log(response);
  }catch (err) {
    console.error(err);
  }
}

export {getLoggedInUser, initializeAccount};
