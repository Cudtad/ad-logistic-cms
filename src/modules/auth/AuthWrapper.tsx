import { FC, PropsWithChildren, useEffect, useState } from "react";
import useAuthStore from "./store/auth.store";
import { SplashScreen } from "@/components/Splash/SplashScreen";
import { useNavigate } from "react-router-dom";
import { getMe } from "./api/auth.api";
import baseAxios from "@/api/base.api";
import { AbilityContext } from "@/utils/context/ability";
import { createMongoAbility } from "@casl/ability";
import { User } from "./type/auth.type";

const buildAbility = (user: User) => {
  const ability = createMongoAbility(user.rules);

  return ability
};

const AuthWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { setUser, user } = useAuthStore();
  const [showSplashScreen, setShowSplashScreen] = useState(!user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const user = await getMe();
        setUser(user);
        baseAxios.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response?.status === 401) {
              navigate("/login");
            }
            return Promise.reject(error);
          },
        );
      } catch (error) {
        navigate("/login");
      } finally {
        setShowSplashScreen(false);
      }
    };

    if (!user) fetch();
  }, []);

  return !user || showSplashScreen ? (
    <SplashScreen />
  ) : (
    <AbilityContext.Provider value={buildAbility(user)}>
      {children}
    </AbilityContext.Provider>
  );
};

export default AuthWrapper;
