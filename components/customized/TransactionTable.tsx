import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn, formatAmount, formatDateTime} from "@/lib/utils";
import {getTransactionCategoryStyle} from "@/lib/constants";

const CategoryBadge = ({children}: { children: string }) => {
  const styleConfig = getTransactionCategoryStyle(children);

  return (
      <div className={`category-badge ${styleConfig.borderColor} ${styleConfig.chipBackgroundColor}`}>
        <div className={`${styleConfig.backgroundColor} size-2 rounded-full`}/>
        <p className={cn("text-[12px] font-medium", styleConfig.textColor)}>{children}</p>
      </div>
  )
}

const TransactionTable = ({transactionList}: { transactionList: Array<Transaction> }) => {
  return (
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">Transaction</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 max-md:hidden">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(transactionList) && transactionList.map((transaction) => {
            // Get transaction status
            const today = new Date();
            const twoDayAgo = new Date(today);
            twoDayAgo.setDate(twoDayAgo.getDate() - 2);
            const status = new Date(transaction.date) > twoDayAgo ? "Processing" : "Success";

            // Formatting amount
            const amount = formatAmount(transaction.amount);

            // Get card type
            const isDebit = transaction.type === "debit";
            const isCredit = transaction.type === "credit";
            return (
                <TableRow key={transaction.id}
                          className={`${isDebit || amount[0] === "-" ? "bg-[#FFFBFA]" : "bg-[#F6FEF9]"} !over:bg-none !border-b-DEFAULT`}>
                  <TableCell className="max-w-[250px] pl-2 pr-10">
                    <div className="flex items-center gap-3">
                      <h1 className="text-14 text-[#344054] truncate font-semibold">
                        {transaction.name.replace(/[^\w\s]/gi, "")}
                      </h1>
                    </div>
                  </TableCell>
                  <TableCell className={`pl-2 pr-10 font-semibold ${(isDebit || amount[0] === "-") ? "text-[#F04438]" : "text-[#039855"}`}>
                    {isDebit ? `-${amount}` : amount}
                  </TableCell>
                  <TableCell className="pl-2 pr-10"><CategoryBadge>{status}</CategoryBadge></TableCell>
                  <TableCell className="min-w-32 pl-2 pr-10">{formatDateTime(new Date(transaction.date)).dateTime}</TableCell>
                  <TableCell className="min-w-24 pl-2 pr-10 capitalize max-md:hidden">{transaction.paymentChannel}</TableCell>
                  <TableCell className="pl-2 pr-10 max-md:hidden"><CategoryBadge>{transaction.category}</CategoryBadge></TableCell>
                </TableRow>
            );
          })}
        </TableBody>
      </Table>
  );
};

export default TransactionTable;
