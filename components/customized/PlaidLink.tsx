import React, {useCallback, useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink} from "react-plaid-link";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {exchangePublicToken, generateLinkToken} from "@/lib/actions/plaid.actions";
import {initializeAccount} from "@/lib/actions/user.actions";

declare type PlaidLinkProps = {
  user: User;
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

const PlaidLink = ({user, variant}: PlaidLinkProps) => {
  const [linkToken, setLinkToken] = useState("");
  const router = useRouter();

  // generate new link token
  useEffect(() => {
    const getLinkToken = async () => {
      const data = await generateLinkToken(user);
      setLinkToken(data?.link_token);
    }
    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (publicToken: string) => {
    await exchangePublicToken(publicToken);
    await initializeAccount();
    router.push(`/`);
  }, [router, user])

  const config: PlaidLinkOptions = {token: linkToken, onSuccess};

  const {open, ready} = usePlaidLink(config);

  return (
      <>
        {variant === "primary" ? (
            <Button onClick={() => open()} disabled={!ready}
                    className="text-16 text-white font-semibold border border-bankGradient rounded-lg bg-bank-gradient shadow-form">
              Connect bank
            </Button>
        ) : (variant === "ghost" ? (
            <Button onClick={() => open()} variant="ghost"
                    className="px-3 py-7 flex justify-center items-center gap-3 rounded-lg cursor-pointer hover:bg-white lg:justify-start">
              <Image src="/icons/connect-bank.svg" alt="connect-bank" width={24} height={24}/>
              <p className="hidden xl:block text-[16px] text-black-2 font-semibold">Connect bank</p>
            </Button>
        ) : (
            <Button onClick={() => open()} className="flex flex-row !justify-start gap-3 rounded-lg !bg-transparent cursor-pointer">
              <Image src="/icons/connect-bank.svg" alt="connect-bank" width={24} height={24}/>
              <p className="text-[16px] text-black-2 font-semibold">Connect bank</p>
            </Button>
        ))}
      </>
  );
};

export default PlaidLink;
