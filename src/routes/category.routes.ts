import { Router } from "express";
import { CreateCategoryController } from "../controllers/categorry/CreateCategoryController";
import { ListCategoryController } from "../controllers/categorry/ListCategoryController";
import { UpdateCategoryController } from "../controllers/categorry/UpdateCategoryController";
import { DetailCategoryController } from "../controllers/categorry/DetailCategoryController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkPermission } from "../middlewares/checkPermission";

const categoryRoutes = Router();

categoryRoutes.post(
  "/category",
  isAuthenticated,
  checkPermission('Categories', 'CREATE'),
  new CreateCategoryController().handle
);

categoryRoutes.get(
  "/categories",
  isAuthenticated,
  checkPermission('Categories', 'READ'),
  new ListCategoryController().handle
);

categoryRoutes.get(
  "/category/detail",
  isAuthenticated,
  checkPermission('Categories', 'READ'),
  new DetailCategoryController().handle
);

categoryRoutes.put(
  "/category/detail",
  isAuthenticated,
  checkPermission('Categories', 'UPDATE'),
  new UpdateCategoryController().handle
);

export { categoryRoutes };
