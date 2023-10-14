import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required."],
    },
    description: {
      type: String,
      required: [true, "Post description is required."],
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Post category is required."],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
