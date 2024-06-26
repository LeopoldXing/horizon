"use server";

import {cookies} from "next/headers";

const BASE_URL = process.env.BASE_URL;

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
export const createTransfer = async (transferData: createTransferProps) => {
  let res = false;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/transaction`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(transferData),
        cache: "no-cache"
      });
      console.log("transaction.actions -> createTransfer -> response")
      console.log(response)
      if (response.ok) {
        const responseData = await response.json();
        res = responseData.data;
        return res;
      }
    }
  } catch (error) {
    console.log(error);
  }
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
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
