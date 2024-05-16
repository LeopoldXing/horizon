"use client"

import React from 'react';
import CountUp from "react-countup";

const AnimatedCounter = ({amount, prefix, decimal, decimals, duration}: {
  amount: number,
  prefix?: string | undefined,
  decimal?: string | undefined,
  decimals?: number | undefined,
  duration?: number | undefined
}) => {
  return (
      <div className="w-full">
        <CountUp end={amount} prefix={prefix} decimal={decimal} decimals={decimals} duration={duration}/>
      </div>
  );
};

export default AnimatedCounter;
