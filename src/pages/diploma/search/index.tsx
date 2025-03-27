import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, Button, Table, message, Empty } from 'antd';
import { useModel } from 'umi';
import type { DiplomaInfo } from '@/models/diploma';
import moment from 'moment';

const DiplomaSearchPage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = React.useState<DiplomaInfo[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const { searchDiplomaInfo, diplomaBooks, graduationDecisions } = useModel('diploma');

  const columns = [
    {
      title: 'Số hiệu',
      dataIndex: 'diplomaNumber',
      key: 'diplomaNumber',
      width: 120,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: 120,
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'MSSV',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
    },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'diplomaBookId',
      key: 'diplomaBookId',
      width: 150,
      render: (id: string) => {
        const book = diplomaBooks.find(b => b.id === id);
        return book ? `Sổ năm ${book.year}` : '-';
      },
    },
    {
      title: 'Quyết định',
      dataIndex: 'graduationDecisionId',
      key: 'graduationDecisionId',
      width: 150,
      render: (id: string) => {
        const decision = graduationDecisions.find(d => d.id === id);
        return decision ? decision.number : '-';
      },
    },
  ];

  const handleSearch = async (values: any) => {
    try {
      // Validate at least 2 search parameters
      const filledFields = Object.entries(values).filter(([_, value]) => value && value.trim()).length;
      if (filledFields < 2) {
        message.error('Vui lòng nhập ít nhất 2 thông tin để tìm kiếm');
        return;
      }

      // Format search params
      const searchParams = {
        diplomaNumber: values.diplomaNumber?.trim(),
        fullName: values.fullName?.trim(),
        dateOfBirth: values.dateOfBirth ? moment(values.dateOfBirth).format('YYYY-MM-DD') : undefined,
        studentId: values.studentId?.trim(),
      };

      // Show loading
      setIsSearching(true);
      message.loading({ content: 'Đang tìm kiếm...', key: 'searching' });

      // Search diploma info
      const results = await searchDiplomaInfo(searchParams);
      
      setSearchResults(results);
      message.success({ 
        content: `Tìm thấy ${results.length} kết quả`, 
        key: 'searching',
        duration: 3
      });
    } catch (error: any) {
      console.error('Error searching diploma:', error);
      message.error({ 
        content: error.message || 'Có lỗi xảy ra khi tìm kiếm',
        key: 'searching',
        duration: 5
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PageContainer>
      <Card title="Tra cứu văn bằng">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Form.Item
            name="diplomaNumber"
            label="Số hiệu văn bằng"
          >
            <Input placeholder="Nhập số hiệu văn bằng" maxLength={20} />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Họ và tên"
          >
            <Input placeholder="Nhập họ và tên" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
          >
            <Input placeholder="Nhập ngày sinh (DD/MM/YYYY)" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="studentId"
            label="Mã số sinh viên"
          >
            <Input placeholder="Nhập mã số sinh viên" maxLength={20} />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isSearching}
              style={{ marginRight: 8 }}
            >
              Tìm kiếm
            </Button>
            <Button 
              onClick={() => {
                form.resetFields();
                setSearchResults([]);
              }}
            >
              Xóa
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card 
        title="Kết quả tìm kiếm" 
        style={{ marginTop: 16 }}
      >
        {searchResults.length > 0 ? (
          <Table
            columns={columns}
            dataSource={searchResults}
            rowKey="id"
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        ) : (
          <Empty 
            description={
              <span>
                {isSearching ? 'Đang tìm kiếm...' : 'Chưa có kết quả tìm kiếm'}
              </span>
            }
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default DiplomaSearchPage; 