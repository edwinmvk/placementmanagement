import adminNotificationModel from "../mongodb/models/adminNotificationModel.js";

const createAdminNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await adminNotificationModel.create({
      creator: id,
      description: req.body.description,
    });
    return res.status(200);
  } catch (error) {
    return res.status(500);
  }
};

const getAdminNotification = async (req, res) => {
  try {
    const notification = await adminNotificationModel.find({});
    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500);
  }
};

const deleteAdminNotification = async (req, res) => {
  try {
    await adminNotificationModel.deleteMany({});
    return res.status(200);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  createAdminNotification,
  getAdminNotification,
  deleteAdminNotification,
};
