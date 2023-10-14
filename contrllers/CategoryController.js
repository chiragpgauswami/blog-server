import CategoryModel from "../model/Category.model.js";

export const getCategory = async (req, res) => {
  try {
    const category = await Category.find({ _id: req.params.id });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not retrieved",
        category: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      category: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const category = await CategoryModel.find({ user: req.params.id });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not retrieved",
        category: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      category: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addCategory = (req, res) => {
  try {
    // console.log(req.body);
    const category = new CategoryModel(req.body);

    category
      .save()
      .then((result) => {
        res
          .status(201)
          .send({ msg: "Category Added Sucessfully", category: result });
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const update = await CategoryModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    if (!update) {
      return res.status(400).json({
        success: false,
        message: "Not successfully updated",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Category successfully updated",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleteCategory = await CategoryModel.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not deleted",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Category successfully deleted",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
