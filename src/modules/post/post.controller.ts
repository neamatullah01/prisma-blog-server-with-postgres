import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helper/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Post creation failed",
      });
    }
    const result = await postService.createPost(
      req.body,
      req.user.id as string
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const status = req.query.status as PostStatus;

    const authorId = req.query.authorId as string;

    // const page = Number(req.query.page ?? 1);
    // const limit = Number(req.query.limit ?? 10);

    // const skip = (page - 1) * limit;

    // const sortBy = req.query.sortBy as string | undefined;
    // const sortOrder = req.query.sortOrder as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
