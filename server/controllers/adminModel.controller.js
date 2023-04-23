import adminModel from "../mongodb/models/adminModel.js";

const getAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminObj = await adminModel.findOne({ username });
    if (!adminObj) {
      return res.status(401).json("Invalid username");
    }

    if (password !== adminObj.password) {
      return res.status(401).json("Invalid password");
    }

    return res.status(200).json("Successfully logged in");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  //   try {
  //     const { username, password } = req.body;

  //     const adminExists = await adminModel.findOne({ username });
  //     if (adminExists) {
  //       return res.status(200).json(adminExists);
  //     }
  //     const newAdmin = await adminModel.create({
  //       username,
  //       password,
  //     });
  //     return res.status(200).json(newAdmin);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
};
const updateAdmin = async (req, res) => {};

export { getAdmin, updateAdmin };
