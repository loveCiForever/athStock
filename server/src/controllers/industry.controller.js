// .server/src/controller/industry.controller.js
import industryModel from "../models/industry.model.js";

const fetchAllIndustryList = async (req, res) => {
  try {
    const industries = await industryModel.find();
    res.status(200).json(industries);
  } catch (error) {
    console.error("Error fetching industries:", error);
    res
      .status(500)
      .json({ message: "Error fetching industries", error: error.message });
  }
};

export { fetchAllIndustryList };
