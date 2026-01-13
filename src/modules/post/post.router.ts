import { NextFunction, Request, Response, Router } from "express";
import { postController } from "./post.controller";
import { UserRole, verifyAuth } from "../../middlewares/verifyAuth";

const router = Router();
router.get("/", postController.getAllPost);
router.get(
  "/my-posts",
  verifyAuth(UserRole.USER, UserRole.ADMIN),
  postController.getMyPosts
);
router.get("/:postId", postController.getPostById);
router.patch(
  "/:postId",
  verifyAuth(UserRole.USER, UserRole.ADMIN),
  postController.updatePost
);
router.post(
  "/",
  verifyAuth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);

export const postRouter = router;
