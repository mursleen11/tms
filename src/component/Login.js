import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

function Login() {
    const navigate = useNavigate();

    // Handle login submission
    const handleLogin = (values) => {
        const data = {
            Email: values.email,
            Password: values.password,
        };

        const url = 'https://localhost:44343/api/user/login';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    console.error('API error details:', err);
                    throw new Error(`Login failed: ${err.message || 'Unknown error'}`);
                });
            }
            return response.json();
        })
        .then(result => {
            if (result) {
                message.success("Login successful!");
                navigate("/UserProfile");
            } 
        })
        .catch(error => {
            console.error("Login error:", error);
            message.error("Login failed. Please try again.");
        });
    };

    // Handle signup navigation
    const handleSignup = () => {
        navigate('/');
    };

    return (
        <div className="login-form" style={{ maxWidth: 400, margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <Form layout="vertical" onFinish={handleLogin}>
                <h1 style={{ textAlign: 'center' }}>Login</h1>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input
                        type="email"
                        placeholder="Enter Your Email"
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter your password!' },
                    ]}
                >
                    <Input.Password
                        placeholder="**********"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </Form.Item>
            </Form>

            <p style={{ textAlign: 'center' }}>
                Don't have an account? <a href="#" onClick={handleSignup}>SignUp</a>
            </p>
        </div>
    );
}

export default Login;
