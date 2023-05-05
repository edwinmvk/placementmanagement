import userModel from "../mongodb/models/userModel.js";

const checkAllUsers = async (req, res) => {
  try {
    const { userid } = req.body;
    const matchid = await userModel.findOne({ userid });
    if (matchid) {
      return res.status(200).json("registered");
    } else {
      return res.status(200).json("unregistered");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {};
const getUserById = async (req, res) => {};

const createUser = async (req, res) => {
  try {
    const { userid, username, email, passoutyear, arrears, cgpa, avatar } =
      req.body;
    if (email.substring(email.indexOf("@") + 1) === "jecc.ac.in") {
      await userModel.create({
        userid,
        username,
        email,
        passoutyear,
        arrears,
        cgpa,
        avatar,
      });
      return res.status(200).json("Successfully registered");
    } else {
      return res.status(401).json("Email domain not recogonized");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {};
const deleteUser = async (req, res) => {};

export {
  checkAllUsers,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
