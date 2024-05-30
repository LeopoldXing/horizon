"use server";

import {plaidClient} from "@/lib/plaid";
import {createAdminClient} from "@/lib/appwrite";
import {ID, Query} from "node-appwrite";

const BASE_URL = process.env.BASE_URL!.endsWith("/")
    ? process.env.BASE_URL!.slice(0, process.env.BASE_URL!.length)
    : process.env.BASE_URL;


/**
 * create new transaction
 * @param transaction
 */
export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const response = await fetch(`${BASE_URL}/transaction`, {
      method: "POST",
      body: JSON.stringify(transaction),
      cache: "no-cache"
    });

    let newTransaction = {};
    if (response.ok) {
      const res = await response.json();
      newTransaction = res.data;
    }

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    console.log(error);
  }
}
declare type CreateTransactionProps = {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}


/**
 * get transaction list by access token
 * @param accessToken
 */
export const getTransactionList = async (accessToken: string) => {
  let res;
  try {
    const response = await fetch(`${BASE_URL}/transaction/list/${accessToken}`, {
      method: "GET",
      next: {revalidate: 5}
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
 * get transaction list by bank id
 * @param bankId
 */
export const getTransactionListByBankId = async (bankId: string) => {
  let res;
  try {
    const response = await fetch(`${BASE_URL}/transaction/bank/${bankId}`, {
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

/*  ----------------------------------------------------------------------------------------------------  */

const getTransactions = async (accessToken: string) => {
  let hasMore = true;
  let transactions: any = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({access_token: accessToken});

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

const getTransactionsByBankId = async (bankId: string) => {
  try {
    const {database} = await createAdminClient();

    const senderTransactions = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_TRANSACTION_COLLECTION_ID!,
        [Query.equal('senderBankId', bankId)],
    )

    const receiverTransactions = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_TRANSACTION_COLLECTION_ID!,
        [Query.equal('receiverBankId', bankId)],
    );

    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [...senderTransactions.documents, ...receiverTransactions.documents]
    }

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.log(error);
  }
}

/*const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const {database} = await createAdminClient();

    const newTransaction = await database.createDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_TRANSACTION_COLLECTION_ID!,
        ID.unique(),
        {channel: 'online', category: 'Transfer', ...transaction}
    )

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    console.log(error);
  }
}*/

export {getTransactions, getTransactionsByBankId};
