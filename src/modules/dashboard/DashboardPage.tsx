import SuspenseView from "@/components/SuspenseView/SuspenseView";
import { Route, Routes } from "react-router-dom";

const OrderPage = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SuspenseView>
            <>Dashboard</>
          </SuspenseView>
        }
      />
    </Routes>
  );
};

export default OrderPage;
