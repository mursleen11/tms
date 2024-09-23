import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

function UserUpdate() {
  const location = useLocation();
  const navigate = useNavigate();

  const { articalListData } = location.state || {}; 

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (articalListData) {
      form.setFieldsValue({
        ArticalName: articalListData.ArticalName,
        Descripation: articalListData.Descripation,
        Author: articalListData.Author,
        Date: articalListData.Date,
        AuthorProfile: articalListData.AuthorProfile
      });
    }
  }, [articalListData, form]);

  const handleFormSubmit = (values) => {
    setLoading(true);

    // Ensure AuthorProfile is included, even if it's null
    const data = {
      ...values,
      ID: articalListData.ID, // Keep the existing ID
      ArticalFile: articalListData.ArticalFile, // Retain the file path
      AuthorProfile: articalListData.AuthorProfile // Ensure AuthorProfile is included
    };debugger;

    console.log('Submitting data:', data); // Log the data to verify

    // Use the same API path or construct from the article list data
    const apiUrl = articalListData.ApiPath || `https://localhost:44343/api/Admin/AdminUpdate/${articalListData.ID}`;

    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update the article: ' + response.statusText);
        }
        return response.json();
      })
      .then(result => {
        message.success('Article updated successfully');
        navigate('/AdminPanel');
      })
      .catch(error => {
        message.error('Error: ' + error.message);
      })
      .finally(() => {
        setLoading(false); // Stop loading state
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {articalListData ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          style={{ width: '30%', border: '1px solid #ccc', margin: '0 auto', padding: '20px', borderRadius: '8px' }}
        >
          <Form.Item
            label="Article Name"
            name="ArticalName"
            rules={[{ required: true, message: 'Please input the article name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="Descripation"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Author"
            name="Author"
            rules={[{ required: true, message: 'Please input the author name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date"
            name="Date"
            rules={[{ required: true, message: 'Please input the date!' }]}
          >
            <Input />
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Article
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div>No article data found.</div>
      )}
    </div>
  );
}

export default UserUpdate;
