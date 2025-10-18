import { Router } from "express";
import { userRoutes } from "./user.routes";
import { categoryRoutes } from "./category.routes";
import { productRoutes } from "./product.routes";
import { orderRoutes } from "./order.routes";

const routes = Router();


routes.use(userRoutes);
routes.use(categoryRoutes);
routes.use(productRoutes);
routes.use(orderRoutes);

export { routes };
