import Users from "../models/user.model.js";

const getUserInfo = async (req, res) => {
  const user_id = req.user;
  //   console.log("userid:", user_id);
  try {
    const user = await Users.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Get user information failed",
        error: "Email is not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get user information successfully",
      data: { user: user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hehehe you are getting some trouble with your backend code",
      error: error,
    });
  }
};

const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    if (typeof bio !== "string" || bio.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Bio must be String and no more than 200 characters",
      });
    }

    const user = await Users.findByIdAndUpdate(
      req.user,
      { "personal_info.bio": bio },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Bio updated successful",
      data: { bio: user.personal_info.bio },
    });
  } catch (error) {
    console.error("[UPDATE BIO ERROR]", error);
    res.status(500).json({
      success: false,
      message: "Network error",
      error: error.message,
    });
  }
};

export { getUserInfo, updateBio };
