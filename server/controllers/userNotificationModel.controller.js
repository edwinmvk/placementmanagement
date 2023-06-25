import userNotificationModel from "../mongodb/models/userNotificationModel.js";

const createUserNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await userNotificationModel.create({
      userid: id,
      description: req.body.description,
    });
    return res.status(200);
  } catch (error) {
    return res.status(500);
  }
};

const getUserNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await userNotificationModel.find({ userid: id });
    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500);
  }
};

const deleteUserNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await userNotificationModel.deleteMany({ userid: id });
    return res.status(200);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { createUserNotification, getUserNotification, deleteUserNotification };
