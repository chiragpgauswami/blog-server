import mongoose from "mongoose";
import CategoryModel from "../model/Category.model.js";
import PostModel from "../model/Post.model.js";

export const getTopCategories = async (req, res) => {
  try {
    const posts = await PostModel.aggregate([
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

    const categoryCounts = {};
    for (const post of posts) {
      const categoryName = post.category_info.categoryname;
      const categoryId = post.category;

      if (!categoryCounts[categoryName]) {
        categoryCounts[categoryName] = {
          id: categoryId,
          postCount: 0,
        };
      }
      categoryCounts[categoryName].postCount++;
    }

    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1].postCount - a[1].postCount)
      .slice(0, 5);

    const category = sortedCategories.map(([categoryName, category]) => ({
      categoryname: categoryName,
      id: category.id,
      postCount: category.postCount,
    }));

    if (!category) {
      return res.status(500).json({
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPostsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryid;
    const searchQuery = req.params.searchquery;

    const pageNo = req.params.page || 1;
    const offset = (pageNo - 1) * 18;

    let posts;

    if (categoryId === "00000" && searchQuery === "00000") {
      posts = await PostModel.aggregate([
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
      ]).skip(offset);
    } else if (searchQuery != "00000") {
      // console.log(searchQuery);
      posts = await PostModel.aggregate([
        {
          $match: {
            title: {
              $regex: searchQuery,
              $options: "i",
            },
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
      ]).skip(offset);
    } else {
      posts = await PostModel.aggregate([
        {
          $match: {
            category: new mongoose.Types.ObjectId(categoryId.toString()),
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
      ]).skip(offset);
    }

    // console.log(posts);

    if (!posts) {
      return res.status(500).json({
        success: false,
        message: "Posts not retrieved",
        posts: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      posts: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
