import { Button, Form, Input, Modal, Select, Space, message } from "antd";
import { UserListItem } from "../type/user.type";
import DebounceSelect from "@/components/Select/DebounceSelect";
import { getListUnit } from "../../unit/api/unit.api";
import { ROLE } from "@/common/constants/role";
import useAuthStore from "@/modules/auth/store/auth.store";

type Props = {
  open: boolean;
  handleClose: () => void;
  editingUser: UserListItem | null;
  onSubmit: (data: any) => Promise<void>;
};

const fetchUnit = async (search: string) => {
  try {
    const res = await getListUnit({ q: search, limit: 30 });
    return res.rows.map((unit: any) => ({
      label: unit.name,
      value: unit.id,
    }));
  } catch (error) {
    message.error(`Error: ${error}`);
  }
};
export default function ModalCreateUser({
  open,
  editingUser,
  handleClose,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const roleWatch = Form.useWatch("role", form);

  const user = useAuthStore((state) => state.user);

  const optionRole = [
    { label: "Sale", value: ROLE.SALE },
    ...(user?.role !== ROLE.MANAGE
      ? [{ label: "Manage", value: ROLE.MANAGE }]
      : []),
  ];

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
        title={editingUser ? "Cập nhập người dùng" : "Tạo mới người dùng"}
        onCancel={handleClose}
        footer={null}
        centered
      >
        <Form
          form={form}
          initialValues={{
            name: editingUser ? editingUser.name : "",
            unitId: editingUser?.unitId || undefined,
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
          {editingUser !== null ? null : (
            <>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email là bắt buộc điền!" },
                  { type: "email", message: "Input type is email!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: "Mật khẩu là bắt buộc điền!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="role"
                label="Chức vụ"
                rules={[
                  { required: true, message: "Chức vụ là bắt buộc điền!" },
                ]}
              >
                <Select options={optionRole} />
              </Form.Item>
            </>
          )}
          {(editingUser?.role === ROLE.SALE || roleWatch === ROLE.SALE) && (
            <Form.Item name="unitId" label="Đơn vị">
              <DebounceSelect
                placeholder="Lựa chọn đơn vị"
                fetchOptions={fetchUnit}
                className="w-full"
                showSearch
              />
            </Form.Item>
          )}

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
