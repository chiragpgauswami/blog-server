import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: [true, "Category name is required."],
  },
});

export default mongoose.model("Category", CategorySchema);