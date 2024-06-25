import { Spin } from "antd";
import { FC } from "react";

const SplashScreen: FC<{ visible?: boolean }> = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Spin tip="Loading ...">
        <div className="w-20 text-center" />
      </Spin>
    </div>
  );
};

export { SplashScreen };
