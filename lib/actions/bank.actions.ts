"use server";

import {cookies} from "next/headers";

const BASE_URL = process.env.BASE_URL;

/**
 * find a bank list related to the userId
 */
export const getBankList = async (): Promise<any> => {
  let res;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/bank/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
        },
        next: {revalidate: 1}
      });
      if (response.ok) {
        res = await response.json();
        return JSON.parse(JSON.stringify(res.data));
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
}


/**
 * find a account list related to a user
 */
export const getAccountList = async (): Promise<any> => {
  let res;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/account/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
        },
        next: {revalidate: 1}
      });
      if (response.ok) {
        res = await response.json();
        return JSON.parse(JSON.stringify(res.data));
      }
    }
  } catch (err) {
    console.error(err);
  }
}


/**
 * find the bank by accountId
 * @param accountId
 */
export const getBankByAccountId = async (accountId: string): Promise<any> => {
  let res;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/bank/accountId/${accountId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
        },
        next: {revalidate: 1}
      });
      if (response.ok) {
        res = await response.json();
        return JSON.parse(JSON.stringify(res));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * get how many banks does a user possess.
 */
export const getUserBankQuantity = async (): Promise<any> => {
  let res = 0;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/user/bank-quantity`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
        },
        next: {revalidate: 5}
      });
      if (response.ok) {
        const responseData = await response.json();
        res = responseData.data;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return res;
}

/**
 * get user's current balance
 */
export const getUserCurrentBalance = async (): Promise<any> => {
  let res: number = 0;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/user/total-balance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=UTF-8"
        },
        next: {revalidate: 5}
      });
      if (response.ok) {
        const responseData = await response.json();
        res = responseData.data;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return res;
}


/**
 * get bank details by id
 * @param bankId
 */
export const getBankInfoById = async (bankId: string) => {
  let res;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/bank/${bankId}`, {
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

export const getTransactionListByAccountId = async (accountId: string) => {
  let res;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/transaction/${accountId}`, {
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

export const getAccountById = async (accountId: string) => {
  let res;
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      const response = await fetch(`${BASE_URL}/account/${accountId}`, {
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
