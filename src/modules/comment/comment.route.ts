import { NextFunction, Request, Response, Router } from "express";
import { commentController } from "./comment.controller";
import { UserRole, verifyAuth } from "../../middlewares/verifyAuth";

const router = Router();

router.get("/:commentId", commentController.getCommentById);

router.post(
  "/",
  verifyAuth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment
);

export const commentRouter = router;
