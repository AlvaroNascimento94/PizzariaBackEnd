import { Router } from "express";
import multer from "multer";
import uploadconfig from "../config/multer";
import { CreateProductController } from "../controllers/product/CreateProductController";
import { ListByCatergoryController } from "../controllers/product/ListByCategoryController";
import { UpdateProductController } from "../controllers/product/UpdateProductController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkPermission } from "../middlewares/checkPermission";

const productRoutes = Router();

const upload = multer(uploadconfig.upload("./tmp"));

productRoutes.post(
  "/product",
  isAuthenticated,
  checkPermission('Products', 'CREATE'),
  upload.single('file'),
  new CreateProductController().handle
);

productRoutes.get(
  "/products",
  isAuthenticated,
  checkPermission('Products', 'READ'),
  new ListByCatergoryController().handle
);

productRoutes.put(
  "/product",
  isAuthenticated,
  checkPermission('Products', 'UPDATE'),
  new UpdateProductController().handle
);

export { productRoutes };
