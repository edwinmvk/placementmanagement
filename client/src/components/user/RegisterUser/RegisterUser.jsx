import React, { useContext, useState } from "react";
import { Context } from "../../../utils/ContextProvider";
import { Button, Form, Typography, Input, InputNumber } from "antd";

const RegisterUser = () => {
  const [form] = Form.useForm();
  const { unRegisteredGoogleUser, googleSignOut } = useContext(Context);
  const onFinish = async (values) => {
    // This async function is to send the form data to the server for updating the database
    try {
      const response = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.status === 200) {
        console.log(data);
        alert("Registration Successful");
        await googleSignOut(); // signout out function will take place only if the status is 200
      } else if (response.status === 401) {
        console.log(data);
        alert("Registration Unsuccessful. Please use jec email id");
      } else {
        console.log(data);
        alert("Registration Unsuccessful. Please try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async () => {
    try {
      form.resetFields();
      await googleSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = {
    userid: parseInt(unRegisteredGoogleUser?.displayName.substring(0, 8)), // 8th character is the space which is excluded
    username: unRegisteredGoogleUser?.displayName.substring(9), // the charcters starting from 9th index to the end of string is taken
    email: unRegisteredGoogleUser?.email,
  };

  const validateMessages = {
    required: "${label} is required!",
    type: {
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  return (
    <div className="mx-5">
      <Typography.Title level={3}>Register new user</Typography.Title>
      <Form
        className="max-w-4xl"
        form={form}
        name="userregisteration"
        validateMessages={validateMessages}
        initialValues={initialValues}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item name="username" label="Student Name">
          <Input readOnly />
        </Form.Item>

        <Form.Item name="userid" label="Student Id" wrapperCol={{ span: 5 }}>
          <InputNumber readOnly />
        </Form.Item>

        <Form.Item name="email" label="Student Email">
          <Input readOnly />
        </Form.Item>

        <Form.Item
          name="passoutyear"
          label="Passout Year"
          wrapperCol={{ span: 5 }}
          rules={[
            {
              type: "number",
              required: true,
              min: 2024,
              max: 2028,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="arrears"
          label="Number of pending Arrears"
          rules={[
            {
              type: "number",
              required: true,
              min: 0,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="cgpa"
          label="Average CGPA till current semester"
          rules={[
            {
              type: "number",
              required: true,
              min: 1,
              max: 10,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item name="avatar" label="Profile Picture">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button className="bg-blue-500" type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
      <br />
      <br />
      <br />
      <button className="border-black" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default RegisterUser;
