import express from "express";
import * as controller from "../controllers/subCategoryController";
import authenticate from "../middlewares/authenticate";
import z from "zod";
import { Types } from "mongoose";
import { validate } from "../middlewares/validation";

const router = express.Router();

const addSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "name needs to be a string",
      required_error: "name is required",
    }),
    parentCategory: z
      .string({
        invalid_type_error: "parentCategory needs to be a string",
        required_error: "parentCategory is required",
      })
      .refine((id: string) => Types.ObjectId.isValid(id), {
        message: "invalid ObjectId",
      }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    subCategoryId: z
      .string({
        invalid_type_error: "subCategoryId needs to be a string",
        required_error: "subCategoryId is required",
      })
      .refine((id: string) => Types.ObjectId.isValid(id), {
        message: "invalid ObjectId",
      }),
    data: z.object({
      name: z
        .string({
          invalid_type_error: "name needs to be a string",
          required_error: "name is required",
        })
        .optional(),
      parentCategory: z
        .string({
          invalid_type_error: "parentCategory needs to be a string",
          required_error: "parentCategory is required",
        })
        .refine((id: string) => Types.ObjectId.isValid(id), {
          message: "invalid ObjectId",
        })
        .optional(),
    }),
  }),
});

router.post(
  "/add",
  authenticate,
  validate(addSchema),
  controller.addSubCategory
);
router.get("/getAllMy", authenticate, controller.getMySubCategorys);
router.get(
  "/getSubByCategory/:id",
  authenticate,
  controller.getMySubCategoriesByCategory
);
router.put(
  "/updateMy",
  authenticate,
  validate(updateSchema),
  controller.updateMySubCategory
);
router.delete(
  "/deleteMy/:id",
  authenticate,
  controller.deleteMySubCategoryById
);

export default router;
