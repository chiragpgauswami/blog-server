import mongoose from "mongoose";
import PostModel from "../model/Post.model.js";

export const getPost = async (req, res) => {
  try {
    const post = await PostModel.find({ _id: req.params.id });
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not retrieved",
        post: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      post: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const post = await PostModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category_info",
        },
      },
      {
        $unwind: {
          path: "$category_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          image: 1,
          category: 1,
          updatedAt: 1,
          "category_info.categoryname": 1,
        },
      },
    ]);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not retrieved",
        post: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      post: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addPost = (req, res) => {
  try {
    const body = req.body;
    // console.log(body);

    const post = new PostModel({
      title: body.title,
      description: body.description,
      image:
        req.protocol +
        "://" +
        req.get("host") +
        "/uploads/" +
        req.file.filename,
      category: body.category,
    });

    post
      .save()
      .then(async (result) => {
        const getPost = await PostModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(result._id.toString()),
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category_info",
            },
          },
          {
            $unwind: {
              path: "$category_info",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              image: 1,
              category: 1,
              updatedAt: 1,
              "category_info.categoryname": 1,
            },
          },
        ]);

        if (!getPost[0]) {
          return res.status(500).json({
            success: false,
            message: "Post not retrieved",
            post: {},
          });
        }

        res.status(201).send({
          success: true,
          message: "Post Added Sucessfully",
          post: getPost[0],
        });
      })
      .catch((error) => {
        // console.log(error);
        return res.status(500).send({
          success: false,
          message: "Unsucessfull to add a Post!",
        });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

export const updatePost = async (req, res) => {
  const body = req.body;

  try {
    let post;
    if (!req.file?.filename) {
      post = {
        title: body.title,
        description: body.description,
        image: body.imageUrl,
        category: body.category,
      };
    } else {
      post = {
        title: body.title,
        description: body.description,
        image:
          req.protocol +
          "://" +
          req.get("host") +
          "/uploads/" +
          req.file.filename,
        category: body.category,
      };
    }

    const update = await PostModel.findOneAndUpdate(
      { _id: req.params.id },
      post
    );

    if (!update) {
      return res.status(500).json({
        success: false,
        message: "Not successfully updated",
        post: {},
      });
    }

    const getPost = await PostModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id.toString()),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category_info",
        },
      },
      {
        $unwind: {
          path: "$category_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          image: 1,
          category: 1,
          updatedAt: 1,
          "category_info.categoryname": 1,
        },
      },
    ]);

    if (!getPost[0]) {
      return res.status(500).json({
        success: false,
        message: "Post not retrieved",
        post: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post successfully updated",
      post: getPost[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const deletePost = await PostModel.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletePost) {
      return res.status(400).json({
        success: false,
        message: "Post not deleted",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post successfully deleted",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
