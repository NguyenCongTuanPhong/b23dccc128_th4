import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic } from 'antd';
import { useModel } from 'umi';
import { BookOutlined, FileTextOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';

const DiplomaPage: React.FC = () => {
  const { 
    diplomaBooks = [], 
    graduationDecisions = [], 
    diplomaInfos = [],
    loading,
  } = useModel('diploma');

  const cards = [
    {
      title: 'Sổ văn bằng',
      value: diplomaBooks.length,
      icon: <BookOutlined />,
      loading: loading.books,
      color: '#1890ff',
    },
    {
      title: 'Quyết định tốt nghiệp',
      value: graduationDecisions.length,
      icon: <FileTextOutlined />,
      loading: loading.decisions,
      color: '#52c41a',
    },
    {
      title: 'Văn bằng đã cấp',
      value: diplomaInfos.length,
      icon: <FormOutlined />,
      loading: loading.infos,
      color: '#722ed1',
    },
    {
      title: 'Lượt tra cứu',
      value: diplomaInfos.reduce((total, info) => total + (info.searchCount || 0), 0),
      icon: <SearchOutlined />,
      loading: loading.infos,
      color: '#fa8c16',
    },
  ];

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        {cards.map((card, index) => (
          <Col key={index} xs={24} sm={12} md={12} lg={6}>
            <Card loading={card.loading}>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={React.cloneElement(card.icon, { 
                  style: { 
                    fontSize: 20, 
                    color: card.color 
                  } 
                })}
                valueStyle={{ 
                  color: card.color,
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card 
        title="Hướng dẫn sử dụng" 
        style={{ marginTop: 24 }}
      >
        <p>
          Hệ thống quản lý văn bằng bao gồm các chức năng chính sau:
        </p>
        <ul>
          <li>
            <strong>Sổ văn bằng:</strong> Quản lý các sổ văn bằng theo năm. Mỗi sổ sẽ có một số hiện tại để tự động tăng khi thêm văn bằng mới.
          </li>
          <li>
            <strong>Quyết định tốt nghiệp:</strong> Quản lý các quyết định tốt nghiệp, bao gồm số quyết định, ngày ban hành và trích yếu.
          </li>
          <li>
            <strong>Trường thông tin:</strong> Tùy chỉnh các trường thông tin cần thiết cho văn bằng, có thể thêm/sửa/xóa các trường tùy theo nhu cầu.
          </li>
          <li>
            <strong>Văn bằng:</strong> Quản lý thông tin văn bằng đã cấp, bao gồm số hiệu, họ tên, ngày sinh, mã sinh viên và các thông tin tùy chỉnh khác.
          </li>
          <li>
            <strong>Tra cứu:</strong> Cho phép tra cứu thông tin văn bằng theo nhiều tiêu chí như số hiệu, họ tên, ngày sinh, mã sinh viên.
          </li>
        </ul>
        <p>
          Lưu ý: Để đảm bảo tính chính xác của dữ liệu, hệ thống sẽ tự động kiểm tra và ngăn chặn việc nhập trùng số hiệu văn bằng hoặc mã sinh viên.
        </p>
      </Card>
    </PageContainer>
  );
};

export default DiplomaPage; 