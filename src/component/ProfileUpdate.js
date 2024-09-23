import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

function ProfileUpdate() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userListData, setUserListData] = useState(null);

  useEffect(() => {
    // Extract userListData from location.state and set to local state
    const data = location.state?.userListData;debugger
    if (data) {
      setUserListData(data);
      form.setFieldsValue({
        UserName: data.UserName,
        Email: data.Email,
        Password: data.Password,
      });
    } else {
      console.error('No userListData found in location.state');
    }
  }, [location.state, form]);

  const handleFormSubmit = (values) => {
    setLoading(true);

    if (!userListData) {
      message.error('No user data available for update');
      setLoading(false);
      return;
    }

    const data = {
      ...values,
      ID: userListData.ID,
    };

    console.log('Submitting data:', data); // Log the data to verify

    const apiUrl = `https://localhost:44343/api/user/update/${userListData.ID}`;

    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update the user: ' + response.statusText);
        }
        return response.json();
      })
      .then(result => {
        message.success('User updated successfully');
        navigate('/UserProfile');
      })
      .catch(error => {
        message.error('Error: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {userListData ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          style={{ width: '30%', border: '1px solid #ccc', margin: '0 auto', padding: '20px', borderRadius: '8px' }}
        >
          <Form.Item
            label="UserName"
            name="UserName"
            rules={[{ required: true, message: 'Please input the UserName!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="Email"
            rules={[{ required: true, message: 'Please input the Email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="Password"
            rules={[{ required: true, message: 'Please input the Password!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div>No user data found.</div>
      )}
    </div>
  );
}

export default ProfileUpdate;
