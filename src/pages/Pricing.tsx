import React from 'react';
import PricingList from '../components/pricing/PricingList';
import PricingHistory from '../components/pricing/PricingHistory';
import PricingForm from '../components/pricing/PricingForm';

const Pricing: React.FC = () => (
  <div className="space-y-6 fade-in">
    <div className="page-header"><h1 className="page-title">Pricing</h1></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <PricingList />
        <PricingHistory />
      </div>
      <PricingForm />
    </div>
  </div>
);
export default Pricing;
