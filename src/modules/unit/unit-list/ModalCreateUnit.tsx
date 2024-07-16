import { Button, Form, Input, Modal, Space, message } from "antd";
import DebounceSelect from "@/components/Select/DebounceSelect";
import { getListZone } from "@/modules/zone/api/zone.api";
import { Unit } from "../type/unit.type";

type Props = {
  open: boolean;
  handleClose: () => void;
  editingUnit: Unit | null;
  onSubmit: (data: any) => Promise<void>;
};

const fetchZone = async (search: string) => {
  try {
    const res = await getListZone({ q: search, limit: 30 });
    return res.rows.map((zone: any) => ({
      label: zone.name,
      value: zone.id,
    }));
  } catch (error) {
    message.error(`Error: ${error}`);
  }
};
export default function ModalCreateUnit({
  open,
  editingUnit,
  handleClose,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const onFinish = async (value: any) => {
    modal.confirm({
      title: "Xác nhận",
      content: "Hãy xác nhận lại nội dung",
      centered: true,
      okText: "Đồng ý",
      cancelText: "Huỷ bỏ",
      onOk: async () => {
        await onSubmit(value).then(() => handleClose());
      },
    });
  };

  return (
    <>
      <Modal
        open={open}
        title={editingUnit ? "Cập nhập đơn vị" : "Tạo mới đơn vị"}
        onCancel={handleClose}
        footer={null}
        centered
      >
        <Form
          form={form}
          initialValues={{
            name: editingUnit ? editingUnit.name : "",
            // unitId: editingUnit?.unitId || undefined,
          }}
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Họ và tên là bắt buộc điền!" }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: "Code là bắt buộc điền!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>

          <Form.Item
            name="zoneId"
            label="Zone"
            rules={[{ required: true, message: "Zone là bắt buộc điền!" }]}
          >
            <DebounceSelect
              placeholder="Lựa chọn zone"
              fetchOptions={fetchZone}
              className="w-full"
              showSearch
              mode="multiple"
            />
          </Form.Item>

          <div className="flex justify-end">
            <Space>
              <Button type="primary" danger ghost onClick={handleClose}>
                Huỷ bỏ
              </Button>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
}
