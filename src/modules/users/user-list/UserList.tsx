import AppBreadcumb from "@/components/AppBreadcumb";
import { useMemo, useState } from "react";
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryParams,
  UserListItem,
} from "../type/user.type";
import type { ColumnsType, TableProps } from "antd/es/table";
import {
  Card,
  Table,
  Input,
  Button,
  Typography,
  message,
  Popconfirm,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getListUser,
  updateUser,
} from "../api/user.api";
import { pageSizeOptions, showTotal } from "@/utils/table";
import { SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";
import { Can } from "@/utils/context/ability";
import { PlusOutlined } from "@ant-design/icons";
import { ACTION, SUBJECT } from "@/common/constants/permission";
import ModalCreateUser from "./ModalCreateUser";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { Link as NavLink } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

function UserList() {
  const [paramsUser, setParamsUser] = useState<UserQueryParams>({
    page: 1,
    limit: 10,
    sort: "-createdAt",
  });

  const [isModalUser, setIsModalUser] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user", paramsUser],
    queryFn: () => getListUser(paramsUser),
    gcTime: 60000,
    notifyOnChangeProps: "all",
  });

  const columns: ColumnsType<UserListItem> = useMemo(
    () => [
      {
        title: "Id",
        dataIndex: "id",
        width: 100,
      },
      {
        title: "Họ và tên",
        dataIndex: "name",
        width: 200,
        sorter: true,
        // render: (name, record) => (
        //   <NavLink
        //     className="block hover:underline"
        //     to={`/user-management/${record.id}`}
        //   >
        //     {name}
        //   </NavLink>
        // ),
      },
      {
        title: "Email",
        dataIndex: "email",
        width: 250,
        sorter: true,
      },
      {
        title: "Chức vụ",
        dataIndex: "role",
        width: 170,
      },
      {
        title: "Unit",
        dataIndex: "unit",
        width: 170,
        render: (unit) => {
          return unit ? unit.name : undefined;
        },
      },
      {
        title: "Thời gian tạo",
        dataIndex: "createdAt",
        width: 170,
        render: (text) => dayjs(text).format("DD-MM-YYYY"),
        sorter: true,
      },
      {
        title: "Thời gian cập nhập",
        dataIndex: "updatedAt",
        width: 170,
        render: (text) => dayjs(text).format("DD-MM-YYYY"),
      },
      {
        title: "Hành động",
        width: 100,
        fixed: "right",
        render: (text, record) => {
          return (
            <div className="flex flex-row gap-x-2">
              <Can I={ACTION.UPDATE} a={SUBJECT.USER}>
                <Button
                  size="small"
                  onClick={() => handleEditModal(record)}
                  icon={<EditOutlined />}
                  type="primary"
                ></Button>
                <div className="h-6 w-[2px] bg-black"></div>
              </Can>
              <Can I={ACTION.DELETE} a={SUBJECT.USER}>
                <Popconfirm
                  title="Xoá người dùng"
                  placement="topRight"
                  description={
                    <div>
                      Bạn có chắc muốn xoá người dùng này?
                      <br />
                      <b>{text.name}</b>
                    </div>
                  }
                  okText="Đồng ý"
                  cancelText="Huỷ bỏ"
                  onConfirm={() => handleConfirmDelete(text.id)}
                >
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    type="primary"
                  ></Button>
                </Popconfirm>
              </Can>
            </div>
          );
        },
      },
    ],
    [data],
  );

  const handleChange: TableProps<UserListItem>["onChange"] = (
    pagination,
    _,
    sorter,
  ) => {
    const _sorter = sorter as SorterResult<UserListItem>;
    let sort: string | undefined;
    if (_sorter) {
      sort =
        _sorter.order === "ascend" ? `${_sorter.field}` : `-${_sorter.field}`;
    }

    setParamsUser((prev) => {
      if (_sorter.order) {
        return {
          ...prev,
          page: pagination.current,
          limit: pagination.pageSize,
          sort,
        };
      } else {
        const updateParams = {
          ...prev,
          page: pagination.current,
          limit: pagination.pageSize,
        };
        delete updateParams.sort;
        return updateParams;
      }
    });
  };

  const tableProps: TableProps<UserListItem> = {
    rowKey: "id",
    bordered: true,
    columns: columns,
    dataSource: data?.rows || [],
    pagination: {
      total: data?.total || 0,
      current: paramsUser.page,
      showSizeChanger: true,
      pageSizeOptions: pageSizeOptions,
      showTotal: showTotal,
    },
    onChange: handleChange,
  };

  const handleFilter = (props: string, value: string | number) => {
    setParamsUser((prev: any) => {
      const updatedParams = { ...prev, page: 1 };
      updatedParams[props] = value !== "" ? value : undefined;

      return updatedParams;
    });
  };

  const handleCloseModal = () => {
    setIsModalUser(false);
    setEditingUser(null);
  };

  const handleEditModal = (record: UserListItem) => {
    setEditingUser(record);
    setIsModalUser(true);
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success("Xoá người dùng thành công!");
      refetch();
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  const onSubmit = async (value: any) => {
    try {
      if (editingUser) {
        const data: UpdateUserDto = {
          name: value.name,
          unitId: value.unitId,
        };
        await updateUser(editingUser.id, data);
        message.success("Cập nhập người dùng thành công!");
      } else {
        const data: CreateUserDto = {
          name: value.name,
          email: value.email,
          password: value.password,
          role: value.role,
          unitId: value.unitId,
        };
        await createUser(data);
        message.success("Tạo mới người dùng thành công!");
      }
      handleCloseModal();
      refetch();
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  return (
    <>
      <AppBreadcumb items={[{ title: "Quản lý người dùng" }]} />
      <Card className="mt-4">
        <Title level={4} className="my-0">
          Quản lí người dùng
        </Title>
        <div className="flex justify-end">
          <div className="flex flex-row gap-x-2">
            <Search
              placeholder="Tìm kiếm tên và email"
              style={{ width: 400 }}
              enterButton
              allowClear
              onSearch={(value) => handleFilter("q", value)}
            />
            <Can I={ACTION.CREATE} a={SUBJECT.USER}>
              <Button
                onClick={() => setIsModalUser(true)}
                icon={<PlusOutlined />}
                type="primary"
              >
                Tạo người dùng
              </Button>
            </Can>
          </div>
        </div>
        <Table
          className="mt-4"
          {...tableProps}
          scroll={{ x: 1300 }}
          loading={isLoading}
        />
      </Card>

      {isModalUser && (
        <ModalCreateUser
          open={isModalUser}
          editingUser={editingUser}
          handleClose={handleCloseModal}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
}

export default UserList;
