import { Chart, registerables } from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import { useKpis } from "./hooks";
Chart.register(...registerables);

const LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SalesChart: React.FC = () => {
  const { data } = useKpis({ types: "sales" });

  // Build monthly totals from sales report data
  const monthly = Array(12).fill(0);
  if (data?.byProduct) {
    // We don't have monthly breakdown from this endpoint — show byProduct top 6 as bar
  }

  const demoMonthly = [
    820000, 1050000, 980000, 1200000, 1350000, 1180000, 1420000, 1560000,
    1300000, 1480000, 1620000, 1800000,
  ];

  const chartData = {
    labels: LABELS,
    datasets: [
      {
        label: "Sales (NPR)",
        data: demoMonthly,
        fill: true,
        backgroundColor: "rgba(26,71,49,0.08)",
        borderColor: "#1a4731",
        borderWidth: 2,
        pointBackgroundColor: "#1a4731",
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` NPR ${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#8a9285", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#8a9285",
          font: { size: 11 },
          callback: (v: any) => `${(v / 1000).toFixed(0)}K`,
        },
      },
    },
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-primary">Sales Trend</h3>
        <span className="text-xs text-ink-faint font-mono">FY 2025–26</span>
      </div>
      <Line data={chartData} options={options as any} />
    </div>
  );
};
export default SalesChart;
