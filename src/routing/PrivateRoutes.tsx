import { FC, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateLayout from "@/layouts/PrivateLayout";
import useAbility from "@/hooks/useAbility";
import { IRoute, renderRoutes } from "./AppRouters";
import { ACTION, SUBJECT } from "@/utils/constants";

const DashboardPage = lazy(() => import("@/modules/dashboard/DashboardPage"));
const UserPage = lazy(() => import("@/modules/users/UserPage"));
const UnitPage = lazy(() => import("@/modules/unit/UnitPage"));
const OrderPage = lazy(() => import("@/modules/order/OrderPage"));

const DefaultPage = () => {
  const ability = useAbility();
  return ability.can(ACTION.READ, SUBJECT.ANALYTICS) ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/order-management" />
  );
};

const PrivateRoutes: FC = () => {
  const routes: IRoute[] = [
    {
      path: "/dashboard/*",
      page: <DashboardPage />,
      sp: true,
      permission: [ACTION.READ, SUBJECT.ANALYTICS],
    },
    {
      path: "/user-management/*",
      page: <UserPage />,
      permission: [ACTION.READ, SUBJECT.USER],
    },
    {
      path: "/order-management/*",
      page: <OrderPage />,
      permission: [ACTION.READ, SUBJECT.ORDER],
    },
    {
      path: "/unit-management/*",
      page: <UnitPage />,
      permission: [ACTION.READ, SUBJECT.UNIT],
    },
  ];

  return (
    <Routes>
      <Route element={<PrivateLayout />}>{renderRoutes(routes)}</Route>
      <Route index element={<DefaultPage />} />
    </Routes>
  );
};

export default PrivateRoutes;
