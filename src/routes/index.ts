import { Router } from "express";
import { userRoutes } from "./user.routes";
import { categoryRoutes } from "./category.routes";
import { productRoutes } from "./product.routes";
import { orderRoutes } from "./order.routes";
import { tableRoutes } from "./table.routes";

const routes = Router();


routes.use(userRoutes);
routes.use(categoryRoutes);
routes.use(productRoutes);
routes.use(orderRoutes);
routes.use(tableRoutes);

export { routes };
