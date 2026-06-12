import React, { useState } from "react";
import PricingForm from "./PricingForm";
import PricingList from "./PricingList";
import { useCustomers } from "../customers/hooks";
import PricingHistory from "./PricingHistory";

const Pricing: React.FC = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  // const [displayMode, setDisplayMode] = useState<
  //   "overrides_only" | "all_products"
  // >("overrides_only");

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const { data: customerList, isLoading: customersLoading } = useCustomers();

  const handleSaved = () => {
    setIsFormOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 relative">
      <div className="bg-surface-50 p-5 rounded-xl border border-surface-200 shadow-sm flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase mb-1.5 tracking-wider">
              Targeted Customer Account *
            </label>
            <select
              className="form-field w-full bg-white border border-surface-300 rounded-lg p-2.5 text-sm"
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setIsFormOpen(false);
              }}
              disabled={customersLoading}
            >
              <option value="">
                {customersLoading
                  ? "Loading customer profiles..."
                  : "Choose a customer profile..."}
              </option>
              {customerList?.data?.map((customer: any) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          {/* <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase mb-1.5 tracking-wider">
              View Scope Filter
            </label>
            <select
              className="form-field w-full bg-white border border-surface-300 rounded-lg p-2.5 text-sm"
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as any)}
              disabled={!selectedCustomerId}
            >
              <option value="overrides_only">
                Show Only Overridden Products (Active Special Contract Sheet)
              </option>
              <option value="all_products">
                Show All Master Products (Global Catalog With Overrides Placed
                Inline)
              </option>
            </select>
          </div> */}
        </div>

        <div className="shrink-0">
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary w-full lg:w-auto h-[42px] px-5 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
          >
            <span>+</span> Create Custom Price Override
          </button>
        </div>
        {/* )} */}
      </div>

      {/* Primary Price Grid Display */}
      <div className="w-full">
        <PricingList
          customerId={selectedCustomerId}
          // showAllProducts={displayMode === "all_products"}
          key={`${selectedCustomerId}-${refreshTrigger}`}
        />
        <PricingHistory selectedCustomerId={selectedCustomerId} />
      </div>

      {/* Backdrop Modal Overlay Container for the Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden border border-surface-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Close Button Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-surface-200 bg-surface-50">
              <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">
                New Price Adjustment Rule
              </span>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-ink-faint hover:text-ink text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Embedded Form Body Section */}
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              <PricingForm onSaved={handleSaved} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
