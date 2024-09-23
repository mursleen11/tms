import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function Admin() {
  const [form] = Form.useForm();
  const [articleName, setArticleName] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState(null);
  const [file, setFile] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('ArticalName', articleName);
    formData.append('Descripation', description);
    formData.append('Author', authorName);
    formData.append('Tags', tags);
    formData.append('Date', date ? date.format('YYYY-MM-DD') : null);
    
    if (file) {
      formData.append('file', file);  // Attach the file
    }
    if(file){
      formData.append('Content', file);
    }
    if (profile) {
      formData.append('profile', profile); debugger; // Attach the profile picture
    }
    
    try {
      const url = 'https://localhost:44343/api/Admin/CreateAdmin';  
      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Article submitted successfully!');
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit article.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        style={{
          width: '30%',
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Admin</h2>

        <Form.Item
          label="Article Name"
          rules={[{ required: true, message: 'Please enter the article name!' }]}
        >
          <Input
            value={articleName}
            onChange={(e) => setArticleName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          rules={[{ required: true, message: 'Please enter the description!' }]}
        >
          <Input.TextArea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Author Name"
          rules={[{ required: true, message: 'Please enter the author name!' }]}
        >
          <Input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Tags"
          rules={[{ required: true, message: 'Please enter the tags' }]}
        >
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Date"
          rules={[{ required: true, message: 'Please select the date!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            value={date}
            onChange={(value) => setDate(value)}
          />
        </Form.Item>

        <Form.Item
          label="File Upload"
        >
          <Upload
            name="file"
            beforeUpload={(uploadedFile) => {
              setFile(uploadedFile);  // Store the uploaded file
              return false;  // Prevent auto upload
            }}
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Click to upload article file</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Author Profile"
        >
          <Upload
            name="profile"
            beforeUpload={(uploadedProfile) => {
              setProfile(uploadedProfile);  // Store the uploaded profile
              return false;  // Prevent auto upload
            }}
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Click to upload author profile</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Admin;
