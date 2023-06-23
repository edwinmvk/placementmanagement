import React, { useContext, useState } from "react";
import { Context } from "../../../utils/ContextProvider";
import {
  Form,
  Typography,
  Input,
  InputNumber,
  Modal,
  Upload,
  message,
  Spin,
} from "antd";

const RegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { unRegisteredGoogleUser, googleSignOut } = useContext(Context);
  const onFinish = async (values) => {
    message.warning("Please wait for confirmation");
    setLoading(true);
    // This async function is to send the form data to the server for updating the database
    try {
      const formData = new FormData();
      formData.append("userid", values.userid);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("passoutyear", values.passoutyear);
      formData.append("arrears", values.arrears);
      formData.append("cgpa", values.cgpa);
      formData.append("avatar", values.avatar[0]?.originFileObj);
      const response = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.status === 200) {
        Modal.success({
          title: "Registration Successful",
          okButtonProps: { className: "bg-blue-500" },
        });
        await googleSignOut(); // signout out function will take place only if the status is 200
      } else if (response.status === 401) {
        Modal.error({
          title: "Registration Unsuccessful",
          content: data,
          okButtonProps: { className: "bg-blue-500" },
        });
      } else {
        Modal.error({
          title: "Registration Unsuccessful",
          content: "Please try again",
          okButtonProps: { className: "bg-blue-500" },
        });
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
    passoutyear:
      parseInt(
        unRegisteredGoogleUser?.email.substring(
          unRegisteredGoogleUser?.email.length - 11,
          unRegisteredGoogleUser?.email.length - 13
        )
      ) + 2004,
    avatar: [],
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      number: "${name} is not a valid number!",
    },
    number: {
      range: "${name} must be between ${min} and ${max}",
    },
    avatar: {
      validator(_, fileList) {
        return new Promise((resolve, reject) => {
          if (fileList && fileList.length !== 0 && fileList[0].size > 614400) {
            reject("File size exceeded");
          } else {
            resolve();
          }
        });
      },
    },
  };

  const sizeChecking = (file) => {
    return new Promise((resolve, reject) => {
      if (file.size > 614400) {
        message.error("Exceeded");
        reject();
      } else {
        resolve();
      }
    });
  };

  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center bg-slate-100">
          <Spin size="large" />
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center sm:h-auto md:h-full lg:h-auto bg-slate-100">
          <div className="flex flex-col">
            <Typography.Title level={2}>
              Student Registration Form
            </Typography.Title>
            <div className="max-w-screen-lg p-4 md:p-8 rounded shadow-lg bg-white">
              <div className="grid gap-4 text-sm grid-cols-1 lg:grid-cols-3 md:grid-rows-5 lg:grid-rows-1">
                <div
                  className="lg:col-span-1 md:row-span-2 text-gray-900 flex flex-col justify-center p-10"
                  style={{
                    backgroundImage: `url(https://i.pinimg.com/564x/68/3c/96/683c969bf2e29f76fb4789b6958327ff.jpg)`,
                  }}
                >
                  <h3 className="font-medium text-3xl">Academic Details</h3>
                  <p className="text-xl">Please fill out all the fields.</p>
                </div>

                <div className="lg:col-span-2 md:row-span-3">
                  <Form
                    form={form}
                    name="userregisteration"
                    validateMessages={validateMessages}
                    initialValues={initialValues}
                    onFinish={onFinish}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-5">
                        <Form.Item
                          name="username"
                          label="Student Name"
                          style={{ marginBottom: "-3px" }}
                        >
                          <Input
                            readOnly
                            style={{
                              height: "40px",
                              width: "100%",
                              backgroundColor: "#f5f4f0",
                            }}
                          />
                        </Form.Item>
                      </div>

                      <div className="md:col-span-5">
                        <Form.Item
                          name="email"
                          label="Student Email"
                          style={{ marginBottom: "-3px" }}
                        >
                          <Input
                            readOnly
                            style={{
                              height: "40px",
                              width: "100%",
                              backgroundColor: "#f5f4f0",
                            }}
                          />
                        </Form.Item>
                      </div>

                      <div className="md:col-span-3">
                        <Form.Item
                          name="userid"
                          label="Student Id"
                          style={{ marginBottom: "-3px" }}
                        >
                          <Input
                            readOnly
                            style={{
                              height: "40px",
                              width: "100%",
                              backgroundColor: "#f5f4f0",
                            }}
                          />
                        </Form.Item>
                      </div>

                      <div className="md:col-span-2">
                        <Form.Item
                          name="passoutyear"
                          label="Passout Year"
                          style={{ marginBottom: "-3px" }}
                        >
                          <InputNumber
                            readOnly
                            style={{
                              height: "40px",
                              width: "100%",
                              backgroundColor: "#f5f4f0",
                            }}
                          />
                        </Form.Item>
                      </div>
                      <div className="md:col-span-2">
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
                          style={{ marginBottom: "-3px" }}
                        >
                          <InputNumber
                            style={{
                              height: "40px",
                              width: "100%",
                              backgroundColor: "#f5f4f0",
                            }}
                          />
                        </Form.Item>
                      </div>

                      <div className="md:col-span-2">
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
                          style={{ marginBottom: "-3px" }}
                        >
                          <InputNumber
                            style={{
                              height: "40px",
                              width: "100%",
                              backgroundColor: "#f5f4f0",
                            }}
                          />
                        </Form.Item>
                      </div>

                      <div className="md:col-span-5">
                        <Form.Item
                          name="avatar"
                          label="Profile Picture"
                          style={{ marginBottom: "-3px" }}
                          valuePropName="fileList" // all the files uploaded through upload will be stored as objects in the fileList array
                          getValueFromEvent={(event) => {
                            // this is a call back function that is similar to the onChange event. Used to obtain the list of images when the onnchange event takes place. This list is then passed for validation
                            return event?.fileList;
                          }}
                          rules={[
                            {
                              required: true,
                            },
                            {
                              validator: (_, fileList) =>
                                validateMessages.avatar.validator(_, fileList),
                            },
                          ]}
                        >
                          <Upload.Dragger
                            maxCount={1}
                            multiple={false}
                            listType="picture"
                            showUploadList={{ showRemoveIcon: true }}
                            accept=".png, .jpg, .jpeg"
                            beforeUpload={(file) => {
                              sizeChecking(file);
                            }}
                          >
                            Drag and drop Profile picture here
                            <br />
                            (formats: .png, ,jpg) (maxsize: 500kb)
                          </Upload.Dragger>
                        </Form.Item>
                      </div>

                      <div className="m-7 md:col-span-5 text-right">
                        <div className="flex justify-between">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            type="submit"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterUser;
