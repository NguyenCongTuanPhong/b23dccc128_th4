import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DiplomaInfo } from '@/models/diploma';
import moment from 'moment';

const DiplomaInfoPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const { 
    diplomaInfos = [], 
    createDiplomaInfo, 
    diplomaBooks,
    graduationDecisions,
  } = useModel('diploma');

  const columns: ProColumns<DiplomaInfo>[] = [
    {
      title: 'Số hiệu',
      dataIndex: 'diplomaNumber',
      width: 120,
      sorter: (a, b) => a.diplomaNumber.localeCompare(b.diplomaNumber),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      width: 200,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      width: 120,
      valueType: 'date',
    },
    {
      title: 'MSSV',
      dataIndex: 'studentId',
      width: 120,
    },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'diplomaBookId',
      width: 150,
      render: (_, record) => {
        const book = diplomaBooks.find(b => b.id === record.diplomaBookId);
        return book ? `Sổ năm ${book.year}` : '-';
      },
    },
    {
      title: 'Quyết định',
      dataIndex: 'graduationDecisionId',
      width: 150,
      render: (_, record) => {
        const decision = graduationDecisions.find(d => d.id === record.graduationDecisionId);
        return decision ? decision.number : '-';
      },
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'searchCount',
      width: 120,
      sorter: (a, b) => (a.searchCount || 0) - (b.searchCount || 0),
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
  ];

  const handleCreate = async (values: any) => {
    try {
      const { 
        diplomaNumber,
        fullName,
        dateOfBirth,
        studentId,
        diplomaBookId,
        graduationDecisionId,
      } = values;

      // Validate required fields
      if (!diplomaNumber || !fullName || !dateOfBirth || !studentId || !diplomaBookId || !graduationDecisionId) {
        message.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      // Format data
      const data = {
        diplomaNumber: diplomaNumber.trim(),
        fullName: fullName.trim(),
        dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
        studentId: studentId.trim(),
        diplomaBookId,
        graduationDecisionId,
      };

      // Show loading
      message.loading({ content: 'Đang tạo thông tin văn bằng...', key: 'creating' });

      // Create diploma info
      const info = await createDiplomaInfo(data);
      
      if (info) {
        message.success({ content: 'Tạo thông tin văn bằng thành công', key: 'creating' });
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error: any) {
      console.error('Error creating diploma info:', error);
      message.error({ 
        content: error.message || 'Có lỗi xảy ra khi tạo thông tin văn bằng',
        key: 'creating',
        duration: 5
      });
    }
  };

  return (
    <PageContainer>
      <ProTable<DiplomaInfo>
        headerTitle="Danh sách văn bằng"
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Thêm văn bằng
          </Button>,
        ]}
        columns={columns}
        dataSource={diplomaInfos}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title="Thêm thông tin văn bằng"
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
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="diplomaNumber"
            label="Số hiệu văn bằng"
            rules={[
              { required: true, message: 'Vui lòng nhập số hiệu văn bằng' },
              { max: 20, message: 'Số hiệu không được quá 20 ký tự' }
            ]}
          >
            <Input placeholder="Nhập số hiệu văn bằng" />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên' },
              { max: 100, message: 'Họ và tên không được quá 100 ký tự' }
            ]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày sinh' },
              {
                validator: (_, value) => {
                  if (value && value.isAfter(moment())) {
                    return Promise.reject('Ngày sinh không được là ngày trong tương lai');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="studentId"
            label="Mã số sinh viên"
            rules={[
              { required: true, message: 'Vui lòng nhập MSSV' },
              { max: 20, message: 'MSSV không được quá 20 ký tự' }
            ]}
          >
            <Input placeholder="Nhập mã số sinh viên" />
          </Form.Item>

          <Form.Item
            name="diplomaBookId"
            label="Sổ văn bằng"
            rules={[
              { required: true, message: 'Vui lòng chọn sổ văn bằng' }
            ]}
          >
            <Select
              placeholder="Chọn sổ văn bằng"
              options={diplomaBooks.map(book => ({
                label: `Sổ năm ${book.year}`,
                value: book.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="graduationDecisionId"
            label="Quyết định tốt nghiệp"
            rules={[
              { required: true, message: 'Vui lòng chọn quyết định tốt nghiệp' }
            ]}
          >
            <Select
              placeholder="Chọn quyết định tốt nghiệp"
              options={graduationDecisions.map(decision => ({
                label: decision.number,
                value: decision.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default DiplomaInfoPage; 