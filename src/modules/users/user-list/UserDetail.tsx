import AppBreadcumb from "@/components/AppBreadcumb";
import { useQuery } from "@tanstack/react-query";
import { Card, List, Spin } from "antd";
import { useParams } from "react-router-dom";
import { getUserDetail } from "../api/user.api";
import dayjs from "dayjs";
import { getListUnit } from "../../unit/api/unit.api";

export default function UserDetail() {
  const params = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["wallet-detail", params.id],
    queryFn: async () => {
      const [resUserDetail, resListUnit] = await Promise.all([
        getUserDetail({ id: params?.id as unknown as number }),
        getListUnit(),
      ]);
      return { resUserDetail, resListUnit };
    },
  });

  return (
    <>
      <AppBreadcumb
        items={[
          { title: "Quản lý người dùng", to: "/user-management" },
          { title: "Chi tiết người dùng" },
        ]}
      />
      <div className="">
        <Spin spinning={isLoading} tip="Loading...">
          <Card
            className="mt-4 max-w-xl mx-auto text-center"
            title="Chi tiết người dùng"
            type="inner"
          >
            <List itemLayout="horizontal" className="text-start">
              <List.Item className="!justify-start">
                <b>Họ và tên: </b>
                {data?.resUserDetail.name}
              </List.Item>
              <List.Item className="!justify-start">
                <b>Email: </b>
                {data?.resUserDetail.email}
              </List.Item>
              <List.Item className="!justify-start">
                <b>Chức vụ: </b>
                {data?.resUserDetail.role}
              </List.Item>
              {data?.resUserDetail?.unitId && (
                <List.Item className="!justify-start">
                  <b>Unit: </b>
                  {
                    data?.resListUnit.rows.filter(
                      (item: any) => item.id === data.resUserDetail.unitId,
                    )[0].name
                  }
                </List.Item>
              )}
              <List.Item className="!justify-start">
                <b>Thời gian tạo: </b>
                {dayjs(data?.resUserDetail.createdAt).format("DD-MM-YYYY")}
              </List.Item>
              <List.Item className="!justify-start">
                <b>Thời gian cập nhập: </b>
                {dayjs(data?.resUserDetail.updatedAt).format("DD-MM-YYYY")}
              </List.Item>
            </List>
          </Card>
        </Spin>
      </div>
    </>
  );
}
