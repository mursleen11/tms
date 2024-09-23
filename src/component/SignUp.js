import React, { Fragment, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from 'antd';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleNameChange = (e) => {
        const inputValue = e.target.value;
        const capitalizedInput = inputValue.replace(/^\w/, (c) => c.toUpperCase());
        setName(capitalizedInput);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSave = () => {

        const data = {
            UserName: name,
            Email: email,
            Password: password,  // Now sending base64-encoded password
            IsActive: true,
        };

        const url = 'https://localhost:44343/api/user/information';  

        axios.post(url, data)
            .then((result) => {
                message.success(result.data);
                // navigate('/Login');
            })
            .catch((error) => {
                message.error("This email is already in use.");
            });
    };

    return (
        <Fragment>
            <div className="signup-form" style={{ maxWidth: 400, margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <Form layout="vertical" onFinish={handleSave}>
                    <h2 className="Sign-Up" style={{ textAlign: 'center' }}>Sign Up</h2>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name!' }]}
                    >
                        <Input
                            id="txtName"
                            placeholder="Enter Name"
                            onChange={handleNameChange}
                            value={name}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                            {
                                pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                message: 'Please enter a valid email address with @gmail.com domain'
                            }
                        ]}
                    >
                        <Input
                            id="txtEmail"
                            placeholder="Enter Email"
                            onChange={handleEmailChange}
                            value={email}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your password!' },
                            {
                                pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/,
                                message: 'Password must contain at least 8 characters, including at least one number, one uppercase letter, and one special character'
                            }
                        ]}
                    >
                        <Input.Password
                            id="txtPassword"
                            placeholder="Enter Your Password"
                            onChange={handlePasswordChange}
                            value={password}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Fragment>
    );
}

export default Signup;
