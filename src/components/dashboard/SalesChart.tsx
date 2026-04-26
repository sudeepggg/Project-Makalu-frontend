import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const SalesChart: React.FC = () => {
  const data = { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ label: 'Sales', data: [1200,2000,1500,3000,2800,3500,4000], backgroundColor: 'rgba(37,99,235,0.1)', borderColor: '#2563eb' }] };
  return <div className="bg-white p-4 rounded shadow"><Line data={data} /></div>;
};

export default SalesChart;