import { NextFunction, Request, Response, Router } from "express";
import { postController } from "./post.controller";
import { UserRole, verifyAuth } from "../../middlewares/verifyAuth";

const router = Router();
router.get("/", postController.getAllPost);
router.post("/", verifyAuth(UserRole.USER), postController.createPost);
router.get("/:postId", postController.getPostById);

export const postRouter = router;
