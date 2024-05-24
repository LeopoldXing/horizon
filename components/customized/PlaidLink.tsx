import React, {useCallback, useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink} from "react-plaid-link";
import {useRouter} from "next/navigation";
import {exchangePublicToken, generateLinkToken} from "@/lib/actions/user.actions";

declare type PlaidLinkProps = {
  user: User;
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

const PlaidLink = ({user, variant}: PlaidLinkProps) => {
  const [token, setToken] = useState("");
  const router = useRouter();

  // generate new link token
  useEffect(() => {
    const getLinkToken = async () => {
      const data = await generateLinkToken(user);
      setToken(data?.link_token);
    }
    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (publicToken: string) => {
    await exchangePublicToken({publicToken, user});
    router.push("/");
  }, [user])

  const config: PlaidLinkOptions = {token, onSuccess};

  const {open, ready} = usePlaidLink(config);

  return (
      <>
        {variant === "primary" ? (
            <Button onClick={() => open()} disabled={!ready}
                    className="text-16 text-white font-semibold border border-bankGradient rounded-lg bg-bank-gradient shadow-form">
              Connect bank
            </Button>
        ) : (variant === "ghost" ? (
            <Button>Connect bank</Button>) : (<Button>Connect bank</Button>))}
      </>
  );
};

export default PlaidLink;
