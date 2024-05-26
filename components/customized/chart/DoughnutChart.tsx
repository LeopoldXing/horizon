"use client"

import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({accounts}: {accounts: Array<Account>}) => {
  const accountNameList = accounts.map(account => account.name);
  const balanceList = accounts.map((account: Account) => account.currentBalance);

  const data = {
    labels: accountNameList,
    datasets: [
      {
        label: "Banks",
        data: balanceList,
        backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"]
      }
    ]
  }

  return (
      <Doughnut data={data} options={{
        cutout: "60%",
        plugins:
            {
              legend: {
                display: false
              }
            }
      }}/>
  );
};

export default DoughnutChart;
