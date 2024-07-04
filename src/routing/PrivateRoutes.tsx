import { FC, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateLayout from "@/layouts/PrivateLayout";
import useAbility from "@/hooks/useAbility";
import { IRoute, renderRoutes } from "./AppRouters";
import { ACTION, SUBJECT } from "@/utils/constants";

const HomePage = lazy(() => import("@/modules/home/HomePage"))

const DefaultPage = () => {
  const ability = useAbility();
  return ability.can(ACTION.READ, SUBJECT.ANALYTICS) ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/order-management" />
  );
};

const PrivateRoutes: FC = () => {
  const routes: IRoute[] = [
    {
      path: "/dashboard/*",
      page: <>dashboard</>,
      sp: true,
      permission: [ACTION.READ, SUBJECT.ANALYTICS],
    },
    {
      path: "/user-management/*",
      page: <>user-management</>,
      permission: [ACTION.READ, SUBJECT.USER],
    },
    {
      path: "/order-management/*",
      page: <>order-management</>,
      permission: [ACTION.READ, SUBJECT.ORDER],
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
