// import { ACTION, SUBJECT } from "@/common/constants/permission";
import SuspenseView from "@/components/SuspenseView/SuspenseView";
// import { Can } from "@/utils/context/ability";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const OrderPage = () => {
  const OrderList = lazy(() => import("./order-list/index"));
  //   const CreateOrder = lazy(() => import("./create-order"));
  //   const UpdateOrder = lazy(() => import("./update-order"));

  return (
    <Routes>
      <Route
        path="/"
        element={
          <SuspenseView>
            <OrderList />
          </SuspenseView>
        }
      />
      {/* <Route
        path="/create"
        element={
          <SuspenseView>
            <Can I={ACTION.CREATE} a={SUBJECT.ORDER}>
              <CreateOrder />
            </Can>
          </SuspenseView>
        }
      />
      <Route
        path="/:id/edit"
        element={
          <SuspenseView>
            <Can I={ACTION.UPDATE} a={SUBJECT.ORDER}>
              <UpdateOrder />
            </Can>
          </SuspenseView>
        }
      /> */}
    </Routes>
  );
};

export default OrderPage;
