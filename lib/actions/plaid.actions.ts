"use server";

import {plaidClient} from "@/lib/plaid";
import {CountryCode, Products} from "plaid";
import {cookies} from "next/headers";
import {revalidatePath} from "next/cache";

const BASE_URL = process.env.BASE_URL;

export const exchangePublicToken = async (publicToken: string) => {
  try {
    if (cookies().has("horizon-token")) {
      const token = cookies().get("horizon-token")!.value;
      await fetch(`${BASE_URL}/plaid/exchange-public-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: publicToken as string,
        next: {revalidate: 5},
        cache: "no-cache"
      });
      revalidatePath("/");
    }
  } catch (err) {
    console.error("Error exchange public token", err);
  }
  return JSON.parse(JSON.stringify({publicTokenExchangeRes: true}));
}

export const generateLinkToken = async (user: User) => {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: {client_user_id: user.userId},
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US", "CA"] as CountryCode[],
    });
    return JSON.parse(JSON.stringify(tokenResponse.data));
  } catch (err) {
    console.error("Error generateLinkToken", err);
  }
}
