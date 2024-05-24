"use server";

import {createAdminClient, createSessionClient} from "@/lib/appwrite";
import {cookies} from "next/headers";
import {ID, Models} from "node-appwrite";
import {plaidClient} from "@/lib/plaid";
import {CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products} from "plaid";
import {btoa} from "node:buffer";
import {revalidatePath} from "next/cache";
import {addFundingSource, createDwollaCustomer} from "@/lib/actions/dwolla.actions";

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
    cookies().set("horizon-session", response.secret, {path: "/", httpOnly: true, sameSite: "strict", secure: true});
  } catch (err) {
    console.error("Error logging in signing in", err);
  }
  return JSON.parse(JSON.stringify(response));
}

/**
 * handle sign up
 * @param data
 */
const signUp = async (data: {
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
}

const signOut = async (): Promise<Boolean> => {
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

export {signIn, signUp, signOut, getLoggedInUser, generateLinkToken, exchangePublicToken, createBankAccount};
