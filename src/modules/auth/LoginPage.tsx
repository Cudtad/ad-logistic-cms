import { Card, Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { getMe, login } from "./api/auth.api";
import useAuthStore from "./store/auth.store";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import { useState } from "react";

const LoginPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await login(values);
      const user = await getMe();
      setUser(user);
      navigate("/");
      message.success("Đăng nhập thành công");
    } catch (error: any) {
      message.error("Đăng nhập thất bại: " + error.message);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <img src={Logo} className="mx-auto h-40 w-48 block mb-8" />
      <Card title="Đăng nhập" bordered={false} className="max-w-md mx-auto">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" type="email" autoFocus/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          {/* <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
