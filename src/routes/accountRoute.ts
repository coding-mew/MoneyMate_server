import express from "express";
import * as controller from "../controllers/accountController";
import authenticate from "../middlewares/authenticate";
import isAdmin from "../middlewares/isAdmin";
import z from "zod";
import { validate } from "../middlewares/validation";
import isIBAN from "validator/lib/isIBAN";
import { Types } from "mongoose";

const router = express.Router();

const addSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "name needs to be a string",
      required_error: "name is required",
    }),
    reference: z.enum(["name", "iban"], {
      required_error: "reference is required",
      invalid_type_error: "reference needs to be a string",
    }),
    iban: z
      .string({
        invalid_type_error: "iban needs to be a string",
      })
      .refine(isIBAN, { message: "not a valid IBAN" })
      .optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    accountId: z
      .string({
        invalid_type_error: "accountId needs to be a string",
        required_error: "accountId is required",
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
      reference: z
        .enum(["name", "iban"], {
          required_error: "reference is required",
          invalid_type_error: "reference needs to be a string",
        })
        .optional(),
      iban: z
        .string({
          invalid_type_error: "iban needs to be a string",
        })
        .refine(isIBAN, { message: "not a valid IBAN" })
        .optional(),
    }),
  }),
});

router.post("/add", authenticate, validate(addSchema), controller.addAccount);
router.get("/getAllMy", authenticate, controller.getMyAccounts);
router.put(
  "/updateMy",
  authenticate,
  validate(updateSchema),
  controller.updateMyAccount
);
router.delete("/deleteMy/:id", authenticate, controller.deleteMyAccountById);

router.get("/all", authenticate, isAdmin, controller.getAllAccounts);

export default router;
