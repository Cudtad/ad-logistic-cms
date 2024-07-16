import SuspenseView from "@/components/SuspenseView/SuspenseView";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const UserPage = () => {
  const UserList = lazy(() => import("./user-list/UserList"));
  const UserDetail = lazy(() => import("./user-list/UserDetail"))

  return (
    <Routes>
      <Route
        path="/"
        element={
          <SuspenseView>
            <UserList />
          </SuspenseView>
        }
      />
      <Route
        path="/:id"
        element={
          <SuspenseView>
            <UserDetail />
          </SuspenseView>
        }
      />
    </Routes>
  );
};

export default UserPage;
