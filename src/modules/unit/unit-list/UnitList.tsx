import Table, { ColumnsType, TableProps } from "antd/es/table";
import {
  CreateUnitDto,
  Unit,
  UnitQueryParams,
  UpdateUnitDto,
} from "../type/unit.type";
import { useMemo, useState } from "react";
import {
  createUnit,
  deleteUnit,
  getListUnit,
  updateUnit,
} from "../api/unit.api";
import { useQuery } from "@tanstack/react-query";
import { pageSizeOptions } from "@/utils/table";
import { SorterResult } from "antd/es/table/interface";
import AppBreadcumb from "@/components/AppBreadcumb";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, message, Popconfirm } from "antd";
import Title from "antd/es/typography/Title";
import { Can } from "@/utils/context/ability";
import { ACTION, SUBJECT } from "@/utils/constants";
import ModalCreateUnit from "./ModalCreateUnit";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function UnitList() {
  const [paramsUnits, setParamsUnits] = useState<UnitQueryParams>({
    page: 1,
    limit: 10,
    sort: "-createdAt",
  });
  const [isModalUnit, setIsModalUnit] = useState<boolean>(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["unit", paramsUnits],
    queryFn: () => getListUnit(paramsUnits),
    gcTime: 60000,
    notifyOnChangeProps: "all",
  });

  const handleConfirmDelete = async (id: number) => {
    try {
      await deleteUnit(id);
      message.success("Xoá người dùng thành công!");
      refetch();
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  const handleEditModal = (record: Unit) => {
    setEditingUnit(record);
    setIsModalUnit(true);
  };

  const columns: ColumnsType<Unit> = useMemo(
    () => [
      {
        title: "Id",
        dataIndex: "id",
        width: 100,
      },
      {
        title: "Tên",
        dataIndex: "name",
        width: 200,
      },
      {
        title: "Code",
        dataIndex: "code",
        width: 100,
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        width: 100,
      },
      {
        title: "Zone",
        dataIndex: "zones",
        width: 100,
        render: (value) =>
          (value || []).map((zone: any) => zone.name).join(","),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        width: 100,
        render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
      },
      {
        title: "Ngày cập nhật",
        dataIndex: "updatedAt",
        width: 100,
        render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
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
                  title="Xoá đơn vị"
                  placement="topRight"
                  description={
                    <div>
                      Bạn có chắc muốn xoá đơn vị này?
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
    [],
  );

  const handleChange: TableProps<Unit>["onChange"] = (
    pagination,
    _,
    sorter,
  ) => {
    const _sorter = sorter as SorterResult<Unit>;
    let sort: string | undefined;
    if (_sorter) {
      sort =
        _sorter.order === "ascend" ? `${_sorter.field}` : `-${_sorter.field}`;
    }

    setParamsUnits((prev) => {
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

  const handleCloseModal = () => {
    setIsModalUnit(false);
    setEditingUnit(null);
  };

  const onSubmit = async (value: any) => {
    console.log(value);

    try {
      if (editingUnit) {
        const data: UpdateUnitDto = {
          name: value.name,
          description: value.description,
          zoneIds: value.zoneId,
        };
        await updateUnit(editingUnit.id, data);
        message.success("Cập nhập đơn vị thành công!");
      } else {
        const data: CreateUnitDto = {
          name: value.name,
          code: value.code,
          description: value.description,
          zoneIds: value.zoneId,
          config: {
            orderProcessFee: 700,
            accountRentFee: 0.015,
          },
        };
        await createUnit(data);
        message.success("Tạo mới đơn vị thành công!");
        handleCloseModal();
      }
      refetch();
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  const tableProps: TableProps<Unit> = {
    rowKey: "id",
    bordered: true,
    columns: columns,
    dataSource: data?.rows || [],
    pagination: {
      total: data?.total || 0,
      current: paramsUnits.page,
      showSizeChanger: true,
      pageSizeOptions: pageSizeOptions,
      showTotal: (total, range) =>
        `${range[0]}-${range[1]} của ${total} đơn vị`,
    },
    onChange: handleChange,
  };

  return (
    <>
      <AppBreadcumb items={[{ title: "Quản lý đơn vị" }]} />
      <Card className="mt-4">
        <Title level={4} className="my-0">
          Quản lí đơn vị
        </Title>
        <div className="flex justify-end">
          <div className="flex flex-row gap-x-2">
            {/* <Search
              placeholder="Tìm kiếm tên và email"
              style={{ width: 400 }}
              enterButton
              allowClear
              onSearch={(value) => handleFilter("q", value)}
            /> */}
            <Can I={ACTION.CREATE} a={SUBJECT.UNIT}>
              <Button
                onClick={() => setIsModalUnit(true)}
                icon={<PlusOutlined />}
                type="primary"
              >
                Tạo đơn vị
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

      {isModalUnit && (
        <ModalCreateUnit
          open={isModalUnit}
          editingUnit={editingUnit}
          handleClose={handleCloseModal}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
}
