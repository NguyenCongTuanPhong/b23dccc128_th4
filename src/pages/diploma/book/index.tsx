import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DiplomaBook } from '@/models/diploma';

const DiplomaBookPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const { diplomaBooks = [], createBook, fetchDiplomaBooks } = useModel('diploma');

  const columns: ProColumns<DiplomaBook>[] = [
    {
      title: 'Năm',
      dataIndex: 'year',
      width: 120,
      sorter: (a, b) => (a.year || 0) - (b.year || 0),
    },
    {
      title: 'Số hiện tại',
      dataIndex: 'currentNumber',
      width: 120,
      render: (dom: any, entity: DiplomaBook) => entity.currentNumber || 1,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 180,
      valueType: 'dateTime',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 180,
      valueType: 'dateTime',
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          onClick={() => {
            // TODO: Implement view details
          }}
        >
          Xem chi tiết
        </Button>,
      ],
    },
  ];

  const handleCreate = async (values: any) => {
    try {
      const { year } = values;
      
      // Validate year
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 1) {
        message.error(`Năm phải nằm trong khoảng từ 1900 đến ${currentYear + 1}`);
        return;
      }

      // Kiểm tra sổ văn bằng đã tồn tại
      const existingBook = diplomaBooks.find(book => book.year === parseInt(year, 10));
      if (existingBook) {
        message.warning(`Đã tồn tại sổ văn bằng cho năm ${year}`);
        return;
      }

      // Show loading message
      message.loading({ content: 'Đang tạo sổ văn bằng...', key: 'creating' });

      // Call API to create book
      const response = await createBook(parseInt(year, 10));
      
      if (!response) {
        throw new Error('Không nhận được phản hồi từ server');
      }

      if (response.status !== 200) {
        throw new Error(response.message || 'Lỗi khi tạo sổ văn bằng');
      }

      // Show success message
      message.success({ content: 'Tạo sổ văn bằng thành công', key: 'creating' });
      
      // Refresh data and reset UI
      await fetchDiplomaBooks();
      setIsModalVisible(false);
      form.resetFields();

    } catch (error: any) {
      console.error('Error creating diploma book:', error);
      message.error({ 
        content: error.message || 'Có lỗi xảy ra khi tạo sổ văn bằng. Vui lòng thử lại sau.',
        key: 'creating',
        duration: 5
      });
    }
  };

  return (
    <PageContainer>
      <ProTable<DiplomaBook>
        headerTitle="Danh sách sổ văn bằng"
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            key="refresh"
            icon={<ReloadOutlined />}
            onClick={() => fetchDiplomaBooks()}
          >
            Làm mới
          </Button>,
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Tạo sổ mới
          </Button>,
        ]}
        columns={columns}
        dataSource={diplomaBooks}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title="Tạo sổ văn bằng mới"
        open={isModalVisible}
        onOk={() => {
          form.validateFields()
            .then(values => {
              handleCreate(values);
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Tạo mới"
        cancelText="Hủy"
        confirmLoading={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{
            year: new Date().getFullYear(),
          }}
        >
          <Form.Item
            name="year"
            label="Năm"
            rules={[
              { required: true, message: 'Vui lòng nhập năm' },
              { type: 'number', min: 1900, message: 'Năm không được nhỏ hơn 1900' },
              { type: 'number', max: new Date().getFullYear() + 1, message: 'Năm không hợp lệ' }
            ]}
          >
            <Input type="number" placeholder="Nhập năm" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default DiplomaBookPage;