"use server";

import {ACHClass, CountryCode, TransferAuthorizationCreateRequest, TransferCreateRequest, TransferNetwork, TransferType} from "plaid";
import {plaidClient} from "../plaid";
import {getTransactionsByBankId} from "./transaction.actions";
import {Query} from "node-appwrite";
import {createAdminClient} from "@/lib/appwrite";
import {getTransactions} from "./transaction.actions";

// Get multiple bank accounts
export const getAccounts = async (userId: string) => {
  try {
    // get banks from db
    const banks = await getBanksByUserId(userId);

    const accounts = await Promise.all(
        banks?.map(async (bank: Bank) => {
          // get each account info from plaid
          const accountsResponse = await plaidClient.accountsGet({access_token: bank.accessToken});
          const accountData = accountsResponse.data.accounts[0];

          // get institution info from plaid
          const institution = await getInstitution(accountsResponse.data.item.institution_id!);

          const account = {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            institutionId: institution.institution_id,
            name: accountData.name,
            officialName: accountData.official_name,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            appwriteItemId: bank.$id,
            shareableId: bank.shareableId,
          };

          return account;
        })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => total + account.currentBalance, 0);

    return JSON.parse(JSON.stringify({data: accounts, totalBanks, totalCurrentBalance}));
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
export const getAccount = async (appwriteItemId: string) => {
  try {
    // get bank from db
    const bank = await getBank(appwriteItemId);

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({access_token: bank.accessToken});
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId(bank.$id);

    const transferTransactions = transferTransactionsData.documents.map(
        (transferData: Transaction) => ({
          id: transferData.$id,
          name: transferData.name!,
          amount: transferData.amount!,
          date: transferData.$createdAt,
          paymentChannel: transferData.channel,
          category: transferData.category,
          type: transferData.senderBankId === bank.$id ? "debit" : "credit",
        })
    );

    // get institution info from plaid
    const institution = await getInstitution(accountsResponse.data.item.institution_id!);

    const transactions = await getTransactions(bank?.accessToken);

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...transactions, ...transferTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return JSON.parse(JSON.stringify({data: account, transactions: allTransactions}));
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
export const getInstitution = async (institutionId: string) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return JSON.parse(JSON.stringify(intitution));
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

export const getBanksByUserId = async (userId: string) => {
  try {
    const {database} = await createAdminClient();

    const banks = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_BANK_COLLECTION_ID!,
        [Query.equal('userId', [userId])]
    );

    return JSON.parse(JSON.stringify(banks.documents));
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async (documentId: string) => {
  try {
    const {database} = await createAdminClient();

    const bank = await database.listDocuments(process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_BANK_COLLECTION_ID!,
        [Query.equal('$id', [documentId])]
    );

    return JSON.parse(JSON.stringify(bank.documents[0]));
  } catch (error) {
    console.log(error);
  }
}

export const getBankByAccountId = async (accountId: string) => {
  try {
    const {database} = await createAdminClient();

    const bank = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_BANK_COLLECTION_ID!,
        [Query.equal('accountId', [accountId])]
    )

    if (bank.total !== 1) return null;

    return JSON.parse(JSON.stringify(bank.documents[0]));
  } catch (error) {
    console.log(error)
  }
}
