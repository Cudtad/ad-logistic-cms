import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// import PrivateLayout from "@/layouts/PrivateLayout";
// import UserPage from "@/modules/users/UserPage";
// import OrderPage from "@/modules/orders/OrderPage";
import useAbility from "@/hooks/useAbility";
// import { IRoute } from "./AppRouters";
import { ACTION, SUBJECT } from "@/utils/constants";
// const DashboardPage = lazy(() => import("@/modules/dashboard/DashboardPage"));

// const HomePage = lazy(() => import("@/modules/home/HomePage"))

const DefaultPage = () => {
  const ability = useAbility();
  return ability.can(ACTION.READ, SUBJECT.ANALYTICS) ? (
    <Navigate to="/dashboard/dashboard-overview" />
  ) : (
    <Navigate to="/order-management" />
  );
};

const PrivateRoutes: FC = () => {
//   const routes: IRoute[] = [
//     {
//       path: "/*",
//       page: < HomePage/>,
//       sp: true,
//     //   permission: [ACTION.READ, SUBJECT.ANALYTICS],
//     },
//     // {
//     //   path: "/user-management/*",
//     //   page: <UserPage />,
//     //   permission: [ACTION.READ, SUBJECT.USER],
//     // },
//     // {
//     //   path: "/order-management/*",
//     //   page: <OrderPage />,
//     //   permission: [ACTION.READ, SUBJECT.ORDER],
//     // },
//   ];

  return (
    <Routes>
      {/* <Route element={<PrivateLayout />}>{renderRoutes(routes)}</Route> */}
      <Route index element={<DefaultPage />} />
    </Routes>
  );
};

export default PrivateRoutes;
