import { Router } from "express";
import multer from "multer";
import uploadconfig from "../config/multer";
import { CreateProductController } from "../controllers/product/CreateProductController";
import { ListByCatergoryController } from "../controllers/product/ListByCategoryController";
import { UpdateProductController } from "../controllers/product/UpdateProductController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkPermission } from "../middlewares/checkPermission";
import { GetProductController } from "../controllers/product/GetProductController";

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

productRoutes.get(
  "/product/:productId",
  isAuthenticated,
  checkPermission('Products', 'READ'),
  new GetProductController().handle
);

productRoutes.put(
  "/product/:productId",
  isAuthenticated,
  checkPermission('Products', 'UPDATE'),
  upload.single('file'),
  new UpdateProductController().handle
);

export { productRoutes };
