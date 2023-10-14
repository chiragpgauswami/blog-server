import { Router } from "express";

import {
  getUser,
  login,
  register,
  updateUser,
  verifyUser,
} from "../contrllers/UserController.js";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../contrllers/CategoryController.js";
import {
  addPost,
  deletePost,
  getAllPost,
  getPost,
  updatePost,
} from "../contrllers/PostController.js";
import upload from "../middleware/fileUpload.js";
import {
  getPostsByCategory,
  getTopCategories,
} from "../contrllers/OtherController.js";

const router = Router();

// ============================================================================== //
//                             UserManagement                                     //
// ============================================================================== //

router.post("/user", register); // Register User
router.post("/login", verifyUser, login); // Login User

router.get("/user/:email", getUser); // Get User By ID

router.put("/user/:username", upload.single("profilePicture"), updateUser); // Update User

// router.delete("/user/:id", deleteUser); // Delete User

// add forgot password

// ============================================================================== //
//                                PostManagement                                  //
// ============================================================================== //

router.post("/post", upload.single("image"), addPost); // Add Post

router.get("/post", getAllPost); // Get All Post
router.get("/post/:id", getPost); // Get Post By ID

router.put("/post/:id", upload.single("image"), updatePost); // Update Post

router.delete("/post/:id", deletePost); // Delete Post

// ============================================================================== //
//                             CategoryManagement                                 //
// ============================================================================== //

router.post("/category", addCategory); // Add Category

router.get("/category", getAllCategory); // Get All Category
router.get("/category/:id", getCategory); // Get Category By ID

router.put("/category/:id", updateCategory); // Update Category

router.delete("/category/:id", deleteCategory); // Delete Category

// ============================================================================== //
//                                Other Apis                                      //
// ============================================================================== //

router.get("/topcategories", getTopCategories); // Get Top 5 Category
router.get("/posts/:categoryid/:page/:searchquery", getPostsByCategory); // Get Top 5 Category

export default router;
