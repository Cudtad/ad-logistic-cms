import { FC, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  message,
  theme,
} from "antd";
import Logo from "@/assets/logo.png";
import LogoSmall from "@/assets/logo-small.png";
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  ContainerOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import useAuthStore from "@/modules/auth/store/auth.store";
import { logout } from "@/modules/auth/api/auth.api";
import useAbility from "@/hooks/useAbility";
import { ACTION, SUBJECT } from "@/common/constants/permission";
// import NotificationPopup from "@/modules/notification/NotificationPopup";

const { Header, Content, Sider } = Layout;

const SLIDER_WIDTH = 240;
const SLIDER_WIDTH_COLLAPSED = 80;
const IS_NAV_COLLAPSED = "IS_NAV_COLLAPSED";

const NavigationItems: any[] = [
  {
    key: "/dashboard",
    label: "Thống kê",
    icon: <AppstoreOutlined />,
    permission: [ACTION.READ, SUBJECT.ANALYTICS],
    children: [
      {
        key: "/dashboard/dashboard-overview",
        label: "Thống kê tổng quát",
      },
      {
        key: "/dashboard/dashboard-comparison",
        label: "Thống kê so sánh",
      },
    ],
  },
  {
    key: "/user-management",
    label: "Quản lý người dùng",
    icon: <UserOutlined />,
    permission: [ACTION.READ, SUBJECT.USER],
  },
  {
    key: "/order-management",
    label: "Quản lý đơn hàng",
    icon: <ContainerOutlined />,
    permission: [ACTION.READ, SUBJECT.ORDER],
  },
  {
    key: "/unit-management",
    label: "Quản lý đơn vị",
    icon: <TeamOutlined />,
    permission: [ACTION.READ, SUBJECT.ORDER],
  },
];

const getSelectedKeys = (menu_items: any, pathname: string) => {
  let selectedKeys: string[] = [];
  let openKeys: string[] = [];
  menu_items.forEach((item: any) => {
    if (item.children?.length > 0) {
      const child = getSelectedKeys(item.children, pathname);
      if (child.selectedKeys.length > 0) {
        selectedKeys = selectedKeys.concat(child.selectedKeys);
        openKeys = openKeys.concat(child.openKeys);
        openKeys.push(item.key);
      }
    } else if (pathname.startsWith(item.key)) {
      selectedKeys.push(item.key);
    }
  });
  return { selectedKeys, openKeys };
};

const PrivateLayout: FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    let collapsed = false;

    try {
      const value = localStorage.getItem(IS_NAV_COLLAPSED);
      if (value === "1") collapsed = true;
    } catch (error) {
      console.error("get state failed", error);
    }
    return collapsed;
  });
  const ability = useAbility();

  const navigationItems = useMemo(() => {
    const mapLinks = (items?: any[]): any[] | undefined => {
      const filterItems: any[] = [];
      items?.forEach((item) => {
        if (
          item.permission &&
          ability.cannot(item.permission[0], item.permission[1])
        )
          return;
        if (!item.children) {
          item.label = <Link to={item.key}>{item.label}</Link>;
        } else {
          item.children = mapLinks(item.children);
        }
        if (!item.children || item.children?.length > 0) {
          filterItems.push(item);
        }
      });

      return filterItems;
    };

    return mapLinks(NavigationItems);
  }, [ability]);

  useEffect(() => {
    if (collapsed) localStorage.setItem(IS_NAV_COLLAPSED, "1");
    else localStorage.removeItem(IS_NAV_COLLAPSED);
  }, [collapsed]);

  const { selectedKeys, openKeys } = useMemo(
    () => getSelectedKeys(navigationItems, location.pathname),
    [location.pathname],
  );

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        // breakpoint="lg"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={SLIDER_WIDTH}
        collapsedWidth={SLIDER_WIDTH_COLLAPSED}
        collapsible
        className="max-h-screen overflow-y-auto"
      >
        <Link to="/">
          <div className="h-24 flex items-center">
            {collapsed ? (
              <img className="h-7 mx-auto" src={LogoSmall} alt="logo" />
            ) : (
              <img className="h-14 mx-auto" src={Logo} alt="logo" />
            )}
          </div>
        </Link>
        <Menu
          theme="dark"
          items={navigationItems}
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
        />
      </Sider>
      <Layout className="max-h-screen overflow-auto">
        <Header
          style={{ background: colorBgContainer }}
          className="px-6 flex justify-between items-center sticky top-0 z-10"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Space>
            {/* <NotificationPopup /> */}
            <UserInfo />
          </Space>
        </Header>
        <Content className="px-6 py-4 flex-none">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

const UserInfo = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "1",
            icon: <UserOutlined />,
            label: user?.email,
          },
          {
            key: "2",
            icon: <LogoutOutlined />,
            label: "Đăng xuất",
            onClick: onLogout,
          },
        ],
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Avatar
        shape="square"
        icon={<UserOutlined />}
        className="cursor-pointer"
      />
    </Dropdown>
  );
};

export default PrivateLayout;
