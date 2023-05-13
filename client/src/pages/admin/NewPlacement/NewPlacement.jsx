import React from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  Typography,
  Modal,
} from "antd";
import moment from "moment";

const NewPlacement = () => {
  const [form] = Form.useForm();

  const sendData = async (values) => {
    if (typeof values !== "object") {
      console.error("Error: values is not an object.");
      return;
    }

    // This async function is to send the form data to the server for updating the database
    try {
      const response = await fetch("http://localhost:3000/api/placements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.status === 200) {
        Modal.success({
          title: data,
          okButtonProps: { className: "bg-blue-500" },
        });
      } else if (response.status === 500) {
        Modal.error({
          title: "Placement not created",
          content: "Please try again",
          okButtonProps: { className: "bg-blue-500" },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const initialValues = {
    placementid: new Date().toISOString().slice(10),
    createdate: moment(),
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

  const onFinish = (values) => {
    console.log(values);
    form.resetFields();

    sendData(values);
  };

  return (
    <div className="mx-5">
      <Typography.Title level={3}>Create New Placement Drive</Typography.Title>
      <Form
        className="max-w-4xl"
        form={form}
        name="newplacements"
        validateMessages={validateMessages}
        initialValues={initialValues}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item
          name="companyname"
          label="Company Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="createdate" label="Current Date">
          <DatePicker disabled />
        </Form.Item>

        <Form.Item name="placementid" label="Id" wrapperCol={{ span: 5 }}>
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="lastdate"
          label="Last date to apply"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="cgpa"
          label="Minimum CGPA"
          rules={[
            {
              type: "number",
              required: true,
              min: 5,
              max: 10,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="arrears"
          label="Maximum Arrears"
          rules={[
            {
              type: "number",
              required: true,
              min: 0,
              max: 5,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="semester"
          label="Current Semester"
          rules={[
            {
              type: "number",
              required: true,
              min: 1,
              max: 8,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button className="bg-blue-500" type="primary" htmlType="submit">
            Create Placement
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewPlacement;
