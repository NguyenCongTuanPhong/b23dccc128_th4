import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DiplomaFormField } from '@/models/diploma';

const DiplomaFieldPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const { 
    diplomaFormFields = [], 
    createFormField,
    updateFormField,
    deleteFormField,
  } = useModel('diploma');

  const columns: ProColumns<DiplomaFormField>[] = [
    {
      title: 'Tên trường',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Mã trường',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'dataType',
      width: 120,
      valueEnum: {
        String: 'Chuỗi',
        Number: 'Số',
        Date: 'Ngày tháng',
      },
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      width: 100,
      valueType: 'switch',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 150,
      valueType: 'dateTime',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 150,
      valueType: 'dateTime',
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            form.setFieldsValue({
              ...record,
              dataType: record.dataType || 'String',
            });
            setIsModalVisible(true);
          }}
        >
          Sửa
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          onClick={() => {
            Modal.confirm({
              title: 'Xác nhận xóa',
              content: 'Bạn có chắc chắn muốn xóa trường này?',
              okText: 'Xóa',
              cancelText: 'Hủy',
              onOk: async () => {
                try {
                  await deleteFormField(record.id);
                  message.success('Xóa trường thành công');
                } catch (error: any) {
                  message.error(error.message || 'Có lỗi xảy ra khi xóa trường');
                }
              },
            });
          }}
        >
          Xóa
        </Button>,
      ],
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      const { id, name, code, dataType, required, description } = values;

      // Format data
      const data = {
        name: name.trim(),
        code: code.trim(),
        dataType: dataType || 'String',
        required: !!required,
        description: description?.trim(),
      };

      // Show loading
      message.loading({ content: 'Đang xử lý...', key: 'saving' });

      if (id) {
        // Update field
        await updateFormField(id, data);
        message.success({ content: 'Cập nhật trường thành công', key: 'saving' });
      } else {
        // Create field
        await createFormField(data);
        message.success({ content: 'Tạo trường thành công', key: 'saving' });
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      console.error('Error saving field:', error);
      message.error({ 
        content: error.message || 'Có lỗi xảy ra khi lưu trường',
        key: 'saving',
        duration: 5
      });
    }
  };

  return (
    <PageContainer>
      <ProTable<DiplomaFormField>
        headerTitle="Danh sách trường thông tin"
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Thêm trường
          </Button>,
        ]}
        columns={columns}
        dataSource={diplomaFormFields}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title={form.getFieldValue('id') ? 'Sửa trường thông tin' : 'Thêm trường thông tin'}
        open={isModalVisible}
        onOk={() => {
          form.validateFields()
            .then(values => {
              handleSubmit(values);
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={form.getFieldValue('id') ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên trường"
            rules={[
              { required: true, message: 'Vui lòng nhập tên trường' },
              { max: 100, message: 'Tên trường không được quá 100 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên trường" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Mã trường"
            rules={[
              { required: true, message: 'Vui lòng nhập mã trường' },
              { max: 50, message: 'Mã trường không được quá 50 ký tự' },
              { pattern: /^[A-Za-z0-9_]+$/, message: 'Mã trường chỉ được chứa chữ cái, số và dấu gạch dưới' }
            ]}
          >
            <Input placeholder="Nhập mã trường" />
          </Form.Item>

          <Form.Item
            name="dataType"
            label="Kiểu dữ liệu"
            initialValue="String"
            rules={[
              { required: true, message: 'Vui lòng chọn kiểu dữ liệu' }
            ]}
          >
            <Select>
              <Select.Option value="String">Chuỗi</Select.Option>
              <Select.Option value="Number">Số</Select.Option>
              <Select.Option value="Date">Ngày tháng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="required"
            label="Bắt buộc"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea 
              placeholder="Nhập mô tả cho trường này" 
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default DiplomaFieldPage; 