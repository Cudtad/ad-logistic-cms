import SuspenseView from "@/components/SuspenseView/SuspenseView";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const UnitPage = () => {
  const UnitList = lazy(() => import("@/modules/unit/unit-list/UnitList"));

  return (
    <Routes>
      <Route
        path="/"
        element={
          <SuspenseView>
            <UnitList />
          </SuspenseView>
        }
      />
    </Routes>
  );
};

export default UnitPage;
