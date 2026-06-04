import Card from "../../components/common/Card";
import InventoryList from "../../components/inventory/InventoryList";
import ReorderAlerts from "../../components/inventory/ReorderAlerts";
import StockMovementLog from "../../components/inventory/StockMovementLog";


const cardsData = [
  {
    title: "Total SKUs",
    subtitle: "Active products",
    icon: "icon-box",
    count: "148",
  },
  {
    title: "Low stock",
    subtitle: "Below reorder level",
    icon: "icon-triangle-alert",
    count: "12",
  },
  {
    title: "Out of stock",
    subtitle: "Needs restocking",
    icon: "icon-ban",
    count: "3",
  },
  {
    title: "Received today",
    subtitle: "batches received",
    icon: "icon-van",
    count: "6",
  },
];

const Inventory = () => (
  <div className="space-y-6 fade-in">
    <div className="page-header">
      <h1 className="page-title">Inventory Management</h1>
    </div>
    <div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,4fr))] gap-2.5 mb-4">
        {cardsData.map((card, idx) => {
          return (
            <Card
              key={idx}
              icon={card.icon}
              title={card.title}
              subtitle={card.subtitle}
              count={card.count}
            />
          );
        })}
      </div>
    </div>
    <InventoryList />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StockMovementLog />
      <ReorderAlerts />
    </div>
  </div>
);
export default Inventory;
