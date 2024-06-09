"use client";

import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {decryptId} from "@/lib/utils";
import {getAccountById, getBankByAccountId} from "@/lib/actions/bank.actions";
import {createTransfer} from "@/lib/actions/transaction.actions";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {BankDropdown} from "@/components/customized/BankDropdown";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(0, "Please select a valid bank account"),
  shareableId: z.string().min(8, "Please select a valid shareable Id"),
});

const PaymentTransferForm = ({accountList}: { accountList: Array<Account> }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      shareableId: ""
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    console.log("paymenttransferform -> onsubmit -> data.senderBank")
    console.log(data.senderBank)

    try {
      const receiverAccountId = decryptId(data.shareableId);
      const receiverBank = await getBankByAccountId(receiverAccountId);
      console.log("paymenttransferform -> onsubmit -> receiverAccountId")
      console.log(receiverAccountId)
      const senderAccount = await getAccountById(data.senderBank);

      console.log("paymenttransferform -> onsubmit -> senderAccount")
      console.log(senderAccount)

      const transferParams = {
        name: data.name,
        amount: data.amount,
        senderId: senderAccount.userId.$id,
        senderBankId: senderAccount.$id,
        receiverId: receiverBank.userId.$id,
        receiverBankId: receiverBank.$id,
        email: data.email,
        sourceFundingSourceUrl: senderAccount.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
      };

      console.log("paymenttransferform -> onsubmit -> transferParams")
      console.log(transferParams)
      // create transfer
      const res = await createTransfer(transferParams);

      // create transfer transaction
      if (res) {
        form.reset();
        router.push("/");
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
          <FormField
              control={form.control}
              name="senderBank"
              render={() => (
                  <FormItem className="border-t border-gray-200">
                    <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 pb-6 pt-5">
                      <div className="flex w-full max-w-[280px] flex-col gap-2">
                        <FormLabel className="text-[14px] leading-[20px] font-medium text-gray-700">
                          Select Source Bank
                        </FormLabel>
                        <FormDescription className="text-[12px] leading-[16px] font-normal text-gray-600">
                          Select the bank account you want to transfer funds from
                        </FormDescription>
                      </div>
                      <div className="flex w-full flex-col">
                        <FormControl>
                          <BankDropdown accounts={accountList} setValue={form.setValue} otherStyles="!w-full"/>
                        </FormControl>
                        <FormMessage className="text-[12px] leading-[16px] text-red-500"/>
                      </div>
                    </div>
                  </FormItem>
              )}
          />

          <FormField control={form.control} name="name" render={({field}) => (
              <FormItem className="border-t border-gray-200">
                <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 pb-6 pt-5">
                  <div className="payment-transfer_form-content">
                    <FormLabel className="text-[14px] leading-[20px] font-medium text-gray-700">
                      Transfer Note (Optional)
                    </FormLabel>
                    <FormDescription className="text-[12px] leading-[16px] font-normal text-gray-600">
                      Please provide any additional information or instructions
                      related to the transfer
                    </FormDescription>
                  </div>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Textarea placeholder="Write a short note here" className="input-class"{...field}/>
                    </FormControl>
                    <FormMessage className="text-[12px] leading-[16px] text-red-500"/>
                  </div>
                </div>
              </FormItem>
          )}/>

          <div className="flex flex-col gap-1 border-t border-gray-200 pb-5 pt-6">
            <h2 className="text-[18px] leading-[22px] font-semibold text-gray-900">
              Bank account details
            </h2>
            <p className="text-[16px] leading-[24px] font-normal text-gray-600">
              Enter the bank account details of the recipient
            </p>
          </div>

          <FormField control={form.control} name="email" render={({field}) => (
              <FormItem className="border-t border-gray-200">
                <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 py-5">
                  <FormLabel className="text-[14px] leading-[20px] w-full max-w-[280px] font-medium text-gray-700">
                    Recipient&apos;s Email Address
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input placeholder="ex: johndoe@gmail.com" className="input-class"{...field}/>
                    </FormControl>
                    <FormMessage className="text-[12px] leading-[16px] text-red-500"/>
                  </div>
                </div>
              </FormItem>
          )}/>

          <FormField control={form.control} name="shareableId" render={({field}) => (
              <FormItem className="border-t border-gray-200">
                <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 pb-5 pt-6">
                  <FormLabel className="text-[14px] leading-[20px] w-full max-w-[280px] font-medium text-gray-700">
                    Receiver&apos;s Plaid Shareable Id
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input placeholder="Enter the public account number" className="input-class"{...field}/>
                    </FormControl>
                    <FormMessage className="text-[12px] leading-[16px] text-red-500"/>
                  </div>
                </div>
              </FormItem>
          )}/>

          <FormField control={form.control} name="amount" render={({field}) => (
              <FormItem className="border-y border-gray-200">
                <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 py-5">
                  <FormLabel className="text-[14px] leading-[20px] w-full max-w-[280px] font-medium text-gray-700">
                    Amount
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input placeholder="ex: 5.00" className="input-class"{...field}/>
                    </FormControl>
                    <FormMessage className="text-[12px] leading-[16px] text-red-500"/>
                  </div>
                </div>
              </FormItem>
          )}/>

          <div className="payment-transfer_btn-box">
            <Button type="submit" className="payment-transfer_btn">
              {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin"/> &nbsp; Sending...
                  </>
              ) : (
                  "Transfer Funds"
              )}
            </Button>
          </div>
        </form>
      </Form>
  );
};

export default PaymentTransferForm;
