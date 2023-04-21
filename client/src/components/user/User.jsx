import React, { useContext } from "react";
import { Context } from "../../utils/ContextProvider";
import { Button, Form, Typography, Input, InputNumber } from "antd";

const User = () => {
  const [form] = Form.useForm();
  const { googleUser, googleSignOut } = useContext(Context);

  const handleSignOut = async () => {
    try {
      await googleSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  // const sendData= async (values)=> { // This async function is to send the form data to the server for updating the database
  //     try{
  //         const response= await fetch('/.....', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(values)
  //         });
  //         const data= await response.json();
  //         console.log(data);
  //     } catch(error){
  //         console.error(error);
  //     }
  // }

  const onFinish = (values) => {
    console.log(values);
    form.resetFields();

    // sendData(values);
  };

  const initialValues = {
    userid: parseInt(googleUser?.displayName.substring(0, 8)), // 8th character is the space which is excluded
    username: googleUser?.displayName.substring(9), // the charcters starting from 9th index to the end of string is taken
    email: googleUser?.email,
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
              min: 0,
              max: 10,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item name="Profile Picture" label="avatar">
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
      <button className="border" onClick={handleSignOut}>
        Logout
      </button>
    </div>
  );
};

export default User;
