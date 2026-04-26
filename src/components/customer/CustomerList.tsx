import React from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import LoadingSpinner from '../common/LoadingSpinner';

const CustomerList: React.FC = () => {
  const { data, isLoading, isError } = useCustomers();
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading customers</div>;

  return (
    <div className="bg-white p-4 rounded shadow overflow-auto">
      <table className="min-w-full">
        <thead className="text-left text-sm text-gray-600"><tr><th>Name</th><th>Type</th><th>City</th><th>Credit</th></tr></thead>
        <tbody>
          {data.map((c:any) => (
            <tr key={c.id} className="border-t">
              <td className="py-2">{c.name}</td>
              <td>{c.customerType?.name}</td>
              <td>{c.city}</td>
              <td>NPR {c.creditLimit?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;