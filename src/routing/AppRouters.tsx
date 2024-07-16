import { FC, ReactNode, Suspense, lazy } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Can } from "@/utils/context/ability";
import { SplashScreen } from "@/components/Splash/SplashScreen";
import PrivateRoutes from "./PrivateRoutes";
import { BASE_ALL_ROUTE } from "./router";
import SuspenseView from "@/components/SuspenseView/SuspenseView";
import AuthWrapper from "@/modules/auth/AuthWrapper";

export interface IRoute {
  path: string;
  page: ReactNode;
  sp?: boolean;
  permission?: [string, string];
}

export const renderRoutes = (routes: IRoute[]) =>
  routes.map(({ path, page, sp, permission }) => {
    let element = sp ? <SuspenseView>{page}</SuspenseView> : page;
    if (permission)
      element = (
        <Can I={permission[0]} a={permission[1]}>
          {element}
        </Can>
      );
    return <Route key={path} path={path} element={element} />;
  });

const App = () => (
  <Suspense fallback={<SplashScreen />}>
    <AuthWrapper>
      <Outlet />
    </AuthWrapper>
  </Suspense>
);

const AppRoutes: FC = () => {
  const LoginPage = lazy(() => import("@/modules/auth/LoginPage"));
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<SplashScreen />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route element={<App />}>
          <Route path={BASE_ALL_ROUTE} element={<PrivateRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
