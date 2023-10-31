import React from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  Typography,
  Modal,
  message,
} from "antd";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const NewPlacement = () => {
  const [form] = Form.useForm();

  const sendData = async (values) => {
    message.warning("Please wait for confirmation");
    // This async function is to send the form data to the server for updating the database
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/placements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        Modal.success({
          title: data,
          okButtonProps: { className: "bg-blue-500" },
        });
      } else if (response.status === 404) {
        Modal.error({
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
    placementid: uuidv4().substring(0, 8),
    createdate: moment(),
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      createdate: moment(values.createdate._d).format("YYYY-MM-DD"), // _d is the key in the moment library that contanins the necessary date info to be converted
      lastdate: moment(values.lastdate.$d).format("YYYY-MM-DD"), // $d is the key in the DatePicker component that contains the necessary date info to be converted
    };

    form.resetFields();

    sendData(formattedValues);
  };

  return (
    <div className="mx-5">
      <div className="px-2.5 py-0.5 mb-4 w-fit bg-stone-100 shadow-lg rounded-md">
        <Typography.Title level={3}>
          Create New Placement Drive
        </Typography.Title>
      </div>
      <div className="mt-3 p-3 w-full bg-stone-100 shadow-sm rounded-md">
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
            <InputNumber precision={2} />
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
            name="passoutyear"
            label="Passoutyear"
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
    </div>
  );
};

export default NewPlacement;
