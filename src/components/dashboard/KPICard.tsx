import React from 'react';

const KPICard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);

export default KPICard;