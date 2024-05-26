import {cn} from "@/lib/utils";
import React from "react";

const CategoryBadge = ({children}: { children: string }) => {
  const getTransactionCategoryStyle = (type: string): {
    borderColor: string,
    backgroundColor: string,
    textColor: string,
    chipBackgroundColor: string
  } => {
    if (type === "Food and Drink") {
      return {
        borderColor: "border-pink-600",
        backgroundColor: "bg-pink-500",
        textColor: "text-pink-700",
        chipBackgroundColor: "bg-inherit",
      };
    } else if (type === "Payment" || type === "Bank Fees") {
      return {
        borderColor: "border-success-600",
        backgroundColor: "bg-green-600",
        textColor: "text-success-700",
        chipBackgroundColor: "bg-inherit",
      };
    } else if (type === "Transfer") {
      return {
        borderColor: "border-red-700",
        backgroundColor: "bg-red-700",
        textColor: "text-red-700",
        chipBackgroundColor: "bg-inherit",
      };
    } else if (type === "Processing") {
      return {
        borderColor: "border-[#F2F4F7]",
        backgroundColor: "bg-gray-500",
        textColor: "text-[#344054]",
        chipBackgroundColor: "bg-[#F2F4F7]",
      };
    } else if (type === "Success") {
      return {
        borderColor: "border-[#12B76A]",
        backgroundColor: "bg-[#12B76A]",
        textColor: "text-[#027A48]",
        chipBackgroundColor: "bg-[#ECFDF3]",
      };
    } else if (type === "Travel") {
      return {
        borderColor: "border-[#0047AB]",
        backgroundColor: "bg-blue-500",
        textColor: "text-blue-700",
        chipBackgroundColor: "bg-[#ECFDF3]",
      };
    } else {
      return {
        borderColor: "",
        backgroundColor: "bg-blue-500",
        textColor: "text-blue-700",
        chipBackgroundColor: "bg-inherit",
      };
    }
  }
  const styleConfig = getTransactionCategoryStyle(children);

  return (
      <div className={`category-badge ${styleConfig.borderColor} ${styleConfig.chipBackgroundColor}`}>
        <div className={`${styleConfig.backgroundColor} size-2 rounded-full`}/>
        <p className={cn("text-[12px] font-medium", styleConfig.textColor)}>{children}</p>
      </div>
  )
}

export default CategoryBadge;
