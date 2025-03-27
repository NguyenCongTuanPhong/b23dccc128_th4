import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { GraduationDecision } from '@/models/diploma';
import moment from 'moment';

const GraduationDecisionPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const { graduationDecisions = [], createDecision, diplomaBooks } = useModel('diploma');

  const columns: ProColumns<GraduationDecision>[] = [
    {
      title: 'Số quyết định',
      dataIndex: 'number',
      width: 150,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issueDate',
      width: 150,
      valueType: 'date',
    },
    {
      title: 'Trích yếu',
      dataIndex: 'summary',
      width: 300,
      ellipsis: true,
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
      const { number, issueDate, summary, diplomaBookId } = values;

      // Validate required fields
      if (!number || !issueDate || !summary || !diplomaBookId) {
        message.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      // Format data
      const data = {
        number: number.trim(),
        issueDate: moment(issueDate).format('YYYY-MM-DD'),
        summary: summary.trim(),
        diplomaBookId,
      };

      // Show loading
      message.loading({ content: 'Đang tạo quyết định...', key: 'creating' });

      // Create decision
      const decision = await createDecision(data);
      
      if (decision) {
        message.success({ content: 'Tạo quyết định thành công', key: 'creating' });
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error: any) {
      console.error('Error creating decision:', error);
      message.error({ 
        content: error.message || 'Có lỗi xảy ra khi tạo quyết định',
        key: 'creating',
        duration: 5
      });
    }
  };

  return (
    <PageContainer>
      <ProTable<GraduationDecision>
        headerTitle="Danh sách quyết định tốt nghiệp"
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
            Thêm quyết định
          </Button>,
        ]}
        columns={columns}
        dataSource={graduationDecisions}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title="Thêm quyết định tốt nghiệp"
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
            name="number"
            label="Số quyết định"
            rules={[
              { required: true, message: 'Vui lòng nhập số quyết định' },
              { max: 50, message: 'Số quyết định không được quá 50 ký tự' }
            ]}
          >
            <Input placeholder="Nhập số quyết định" />
          </Form.Item>

          <Form.Item
            name="issueDate"
            label="Ngày ban hành"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày ban hành' },
              {
                validator: (_, value) => {
                  if (value && value.isAfter(moment())) {
                    return Promise.reject('Ngày ban hành không được là ngày trong tương lai');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="summary"
            label="Trích yếu"
            rules={[
              { required: true, message: 'Vui lòng nhập trích yếu' },
              { max: 500, message: 'Trích yếu không được quá 500 ký tự' }
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập trích yếu quyết định" />
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
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default GraduationDecisionPage; 