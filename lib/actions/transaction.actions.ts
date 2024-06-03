"use server";

import {cookies} from "next/headers";

const BASE_URL = process.env.BASE_URL + "/api/v1";

declare type createTransferProps = {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
}
export const createTransfer = async (transferData: createTransferProps): Promise<boolean> => {
  let res = false;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/transaction`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(transferData),
        cache: "no-cache"
      });

      if (response.ok) {
        const responseData = await response.json();
        res = responseData.data;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return res;
}


/**
 * get user's transaction list
 */
export const getTransactionListByUser = async (): Promise<any> => {
  let res;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/user/transaction/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
        next: {revalidate: 1}
      });
      if (response.ok) {
        res = await response.json();
      }
    }
  } catch (err) {
    console.error(err);
  }
  return JSON.parse(JSON.stringify(res.data));
}


/**
 * get transaction list by access token
 * @param accessToken
 */
export const getTransactionListByAccessToken = async (accessToken: string) => {
  let res;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/transaction/list/${accessToken}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
        next: {revalidate: 5}
      });
      if (response.ok) {
        res = await response.json();
      }
    }
  } catch (err) {
    console.error(err);
  }
  return JSON.parse(JSON.stringify(res.data));
}

/**
 * get transaction list by bank id
 * @param bankId
 */
export const getTransactionListByBankId = async (bankId: string) => {
  let res;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/transaction/bank/${bankId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
        next: {revalidate: 1}
      });
      if (response.ok) {
        const responseData = await response.json();
        res = responseData.data;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return JSON.parse(JSON.stringify(res));
}
