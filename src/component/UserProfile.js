import React, { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Row, Col, Table, Space, Spin, message, Layout, Typography, Menu } from 'antd';
import axios from "axios";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function UserProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userListData, setUserListData] = useState([]);
    const [searchText, setSearchText] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.get(`https://localhost:44343/api/user/Userlist`);
            setUserListData(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Would you like to delete?");
        if (confirmDelete) {
            axios.delete(`https://localhost:44343/api/user/delete/${id}`)
                .then(() => {
                    message.success("User deleted successfully");
                    fetchUserData();
                })
                .catch((err) => message.error("Delete failed"));
        }
    };

    const handleUpdate = (id) => {
        const selectedUser = userListData.find((user) => user.ID === id);
        const checkoutUrl = `/ProfileUpdate/${id}`; 
        navigate(checkoutUrl, { state: { userListData: selectedUser } });
    };

    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const filteredData = userListData.filter(user =>
        user.UserName.toLowerCase().includes(searchText) ||
        user.Email.toLowerCase().includes(searchText)
    );

    const columns = [
        {
            title: 'UserName',
            dataIndex: 'UserName',
            key: 'UserName',
        },
        {
            title: 'Email',
            dataIndex: 'Email',
            key: 'Email',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record.ID)}>
                        Edit
                    </Button>
                    <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.ID)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: 'white', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={3} style={{ color: '#001529', margin: 0 }}>Tag Management System</Title>
                    <Menu mode="horizontal" theme="dark" style={{ lineHeight: '64px', backgroundColor: '#001529' }}>
                        <Menu.Item key="admin">
                            <Link to="/admin">Data Enter</Link>
                        </Menu.Item>
                        <Menu.Item key="signup">
                            <Link to="/signup">Register</Link>
                        </Menu.Item>
                        <Menu.Item key="userProfile">
                            <Link to="/AdminPanel">Artical List</Link>
                        </Menu.Item>
                    </Menu>
                </div>
            </Header>

            <Content style={{ padding: '20px 50px', background: '#f0f2f5' }}>
                <div style={{
                    border: '1px solid #d9d9d9', borderRadius: '4px',
                    padding: '16px', backgroundColor: '#fff'
                }}>
                    <Row gutter={16} style={{ marginBottom: '16px' }}>
                        <Col xs={24} sm={12} md={8}>
                            <Input.Search
                                placeholder="Search..."
                                style={{ width: '100%' }}
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={16} style={{ textAlign: 'right' }}>
                            <span>Total Records: {filteredData.length}</span>
                        </Col>
                    </Row>
                    <hr />
                    {loading ? (
                        <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
                    ) : (
                        <Table
                            dataSource={filteredData}
                            columns={columns}
                            rowKey="ID"
                            style={{ marginTop: '20px' }}
                        />
                    )}
                    {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>Tag Management System ©2024 Created by You</Footer>
        </Layout>
    );
}

export default UserProfile;
