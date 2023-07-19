import { Router } from "express";
import {
  createBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
} from "./brand.controller";
import { createBrandSchema, editBrandSchema } from "./brand.schema";
import verifyAccessToken, { isAdmin } from "../../middlewares/auth.middleware";

const addressRoutes: Router = Router();
addressRoutes.post(
  "/",
  verifyAccessToken,
  isAdmin,
  createBrandSchema,
  createBrand
);
addressRoutes.get("/", getAllBrand);
addressRoutes.patch(
  "/",
  verifyAccessToken,
  isAdmin,
  editBrandSchema,
  updateBrand
);
addressRoutes.delete("/", verifyAccessToken, isAdmin, deleteBrand);

export default addressRoutes;
