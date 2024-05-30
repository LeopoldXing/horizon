"use server";

import {createAdminClient, createSessionClient} from "@/lib/appwrite";
import {cookies} from "next/headers";
import {ID, Models, Query} from "node-appwrite";
import {plaidClient} from "@/lib/plaid";
import {CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products} from "plaid";
import {btoa} from "node:buffer";
import {revalidatePath} from "next/cache";
import {addFundingSource, createDwollaCustomer} from "@/lib/actions/dwolla.actions";
import {md5} from "jiti/dist/utils";

const BASE_URL = process.env.BASE_URL!.endsWith("/")
    ? process.env.BASE_URL!.slice(0, process.env.BASE_URL!.length)
    : process.env.BASE_URL;


export const getUserInfoById = async (userId: string): Promise<any> => {
  let res = null;
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      method: "GET",
      next: {revalidate: 1}
    });
    if (response.ok) {
      res = await response.json();
      return JSON.parse(JSON.stringify(res.data));
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * user sign-in
 * @param email
 * @param password
 */
export const signIn = async (email: string, password: string): Promise<any> => {
  let session, user;
  try {
    const response = await fetch(`${BASE_URL}/user/sign-in`, {
      method: "POST",
      body: JSON.stringify({email, password: md5(password)}),
      next: {revalidate: 5}
    });
    if (response.ok) {
      const res = await response.json();
      const data = res.data;
      session = data.session;
      user = data.user;
    }
  } catch (err) {
    console.error(err);
  }
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
      cookies().delete("horizon-session");
    }
  } catch (err) {
    console.error("Error logging out signing out", err);
  }

  return res;
}

export const signUp = async (data: {
  firstName: string;
  lastName: string;
  address1: string;
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
    address1,
    city,
    postalCode,
    dateOfBirth,
    ssn,
    state
  } = data;
  let newUser;
  try {


  } catch (err) {
    console.error("Error logging in signing up", err);
  }

  return JSON.parse(JSON.stringify(newUser));
}

/*  ----------------------------------------------------------------------------------------------------  */

const getUserInfo = async (userId: string): Promise<User> => {
  let res = null;
  try {
    const {database} = await createAdminClient();
    const appwriteUser = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_USER_COLLECTION_ID!,
        [Query.equal('userId', [userId])]
    );
    res = JSON.parse(JSON.stringify(appwriteUser.documents[0]));
  } catch (err) {
    console.error("Error getting userInfo");
    console.error(err);
  }
  return res;
}

/**
 * handle sign in
 * @param data
 */
/*const signIn = async (data: SignInProps): Promise<Models.Session> => {
  const {email, password} = data;

  let user = null;
  try {
    const {account} = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("horizon-session", session.secret, {path: "/", httpOnly: true, sameSite: "strict", secure: true});

    user = await getUserInfo(session.userId);
  } catch (err) {
    console.error("Error logging in signing in", err);
  }
  return JSON.parse(JSON.stringify(user));
}*/

/**
 * handle sign up
 * @param data
 */
/*const signUp = async (data: {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  password: string;
}): Promise<User> => {
  const {
    email,
    password,
    firstName,
    lastName,
    address1,
    city,
    postalCode,
    dateOfBirth,
    ssn,
    state
  } = data;
  let newUser;

  try {
    const {account} = await createAdminClient();

    const newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
    if (!newUserAccount) {
      throw new Error("Error creating user account");
    }
    const dwollaCustomerUrl = await createDwollaCustomer({...data, type: "personal"});
    if (!dwollaCustomerUrl) {
      throw new Error("Error creating Dwolla customer");
    }
    const urlPaths = dwollaCustomerUrl.split("/");
    const dwollaCustomerId = urlPaths[urlPaths.length - 1];

    // add to the database
    const {database} = await createAdminClient();
    newUser = await database.createDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_USER_COLLECTION_ID!,
        ID.unique(),
        {
          userId: newUserAccount.$id,
          email,
          firstName,
          lastName,
          address1,
          city,
          postalCode,
          dateOfBirth,
          ssn,
          state,
          dwollaCustomerId,
          dwollaCustomerUrl
        });

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("horizon-session", session.secret, {path: "/", httpOnly: true, sameSite: "strict", secure: true});
  } catch (err) {
    console.error("Error logging in signing up", err);
  }

  return JSON.parse(JSON.stringify(newUser));
}*/

/*const signOut = async (): Promise<Boolean> => {
  let res = false;

  try {
    const {account} = await createSessionClient();
    cookies().delete("horizon-session");
    await account.deleteSession("current");
    res = true;
  } catch (err) {
    console.error("Error logging out signing out", err);
    res = false;
  }

  return res;
}*/

const getLoggedInUser = async (): Promise<User> => {
  let res = null;
  try {
    const {account} = await createSessionClient();
    const appwriteAccount = await account.get();
    const userId = appwriteAccount.$id;
    const user = await getUserInfo(userId);
    user.name = `${user.firstName} ${user.lastName}`;
    res = JSON.parse(JSON.stringify(user));
  } catch (error) {
  }
  return res;
}

const generateLinkToken = async (user: User) => {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: {client_user_id: user.$id},
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    });
    return JSON.parse(JSON.stringify(tokenResponse.data));
  } catch (err) {
    console.error("Error generateLinkToken", err);
  }
}

const exchangePublicToken = async ({publicToken, user}: { publicToken: string, user: User }) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({public_token: publicToken});
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using access token
    const accountsResponse = await plaidClient.accountsGet({access_token: accessToken});
    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) {
      throw new Error("the funding source URL is not created");
    }

    // Create a bank account using the user Id, item Id, account Id, access token, funding source URL, and shareable Id
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: btoa(accountData.account_id)
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");
  } catch (err) {
    console.error("Error generateLinkToken", err);
  }

  return JSON.parse(JSON.stringify({publicTokenExchangeRes: true}));
}

const createBankAccount = async ({userId, bankId, accountId, accessToken, fundingSourceUrl, shareableId}: {
  accessToken: string;
  userId: string;
  accountId: string;
  bankId: string;
  fundingSourceUrl: string;
  shareableId: string;
}) => {
  try {
    const {database} = await createAdminClient();
    const bankAccount = await database.createDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_BANK_COLLECTION_ID!,
        ID.unique(),
        {userId, bankId, accountId, accessToken, fundingSourceUrl, shareableId});
    return JSON.parse(JSON.stringify(bankAccount));
  } catch (err) {
    console.error("Creating Bank Account", err);
  }
}

export {getUserInfo, getLoggedInUser, generateLinkToken, exchangePublicToken, createBankAccount};
