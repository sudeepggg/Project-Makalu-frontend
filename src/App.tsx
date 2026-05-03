import { RouterProvider } from "react-router-dom";
import { router } from "./router";

// App.tsx  ← can be deleted entirely, or kept minimal
export default function App() {
  return <RouterProvider router={router} />;
}