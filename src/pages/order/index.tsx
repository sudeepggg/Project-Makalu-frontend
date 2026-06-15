import { useState } from "react";
import OrderDetail from "./OrderDetail";
import OrderList from "./OrderList";

const Orders = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (selectedId) {
    return (
      <div className="">
        <OrderDetail id={selectedId} onBack={() => setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full h-full">
      <OrderList onSelect={(id) => setSelectedId(id)} />
    </div>
  );
};
export default Orders;
