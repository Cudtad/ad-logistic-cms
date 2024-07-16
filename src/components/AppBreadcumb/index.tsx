import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React from "react";

type Item = {
  title: React.ReactNode;
  to?: string;
};

type Props = {
  items: Item[];
};

const AppBreadcumb = ({ items }: Props) => {
  return (
    <Breadcrumb
      items={[
        {
          title: (
            <Link to="/">
              <HomeOutlined />
            </Link>
          ),
        },
        ...items.map((item, i) => ({
          title: item.to ? <Link to={item.to}>{item.title}</Link> : item.title,
          key: item.to || i + 1,
        })),
      ]}
    />
  );
};

export default AppBreadcumb;
