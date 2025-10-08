import { Router, Response, Request } from "express";
import multer from "multer";
import uploadconfig from "./config/multer";

import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserControlle";
import { DetailUserControler } from "./controllers/user/DetailUserController";

import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/categorry/CreateCategoryController";
import { ListCategoryController } from "./controllers/categorry/ListCategoryController";
import { CreateProductController } from "./controllers/product/CreateProductController";

import { ListByCatergoryController } from "./controllers/product/ListByCategoryController";
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { DeleteOrderController } from "./controllers/order/DeleteOrderConstroller";
import { AddItemController } from "./controllers/order/AddItemController";
import { DeleteItemController } from "./controllers/order/DeleteItemController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { ListOrdersController } from "./controllers/order/ListOrdersController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";

const router = Router();

const upload = multer(uploadconfig.upload("./tmp"))
/* rotas user */
router.post("/users", new CreateUserController().handle);

router.post("/session", new AuthUserController().handle);

router.get("/me" ,isAuthenticated, new DetailUserControler().handle);

/* rotas de categorias */
router.post("/category",isAuthenticated, new CreateCategoryController().handle)

router.get("/list", isAuthenticated, new ListCategoryController().handle)

/* rotas de produtos */
router.post("/createProduct", isAuthenticated, upload.single('file'), new CreateProductController().handle)

router.get("/category/product", isAuthenticated, new ListByCatergoryController().handle)

/* rotas de order */
router.post("/order", isAuthenticated, new CreateOrderController().handle)

router.delete("/order", isAuthenticated, new DeleteOrderController().handle)

router.post("/order/add", isAuthenticated, new AddItemController().handle)

router.delete("/order/delete", isAuthenticated, new DeleteItemController().handle)

router.put("/order/send", isAuthenticated, new SendOrderController().handle)

router.get("/orders", isAuthenticated, new ListOrdersController().handle)

router.get("/order/detail", isAuthenticated, new DetailOrderController().handle)

router.put("/order/finish", isAuthenticated, new FinishOrderController().handle)
export { router };
