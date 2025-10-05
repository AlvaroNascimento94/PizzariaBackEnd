import { Router, Response, Request } from "express";

import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserControlle";
import { DetailUserControler } from "./controllers/user/DetailUserController";

import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/categorry/CreateCategoryController";

const router = Router();

/* rotas user */
router.post("/users", new CreateUserController().handle);

router.post("/session", new AuthUserController().handle);

router.get("/me" ,isAuthenticated, new DetailUserControler().handle);

/* rotas de categorias */
router.post("/category",isAuthenticated, new CreateCategoryController().handle)
export { router };
