import { Router } from "express";
import { CreateOrderController } from "../controllers/order/CreateOrderController";
import { DeleteOrderController } from "../controllers/order/DeleteOrderConstroller";
import { AddItemController } from "../controllers/order/AddItemController";
import { DeleteItemController } from "../controllers/order/DeleteItemController";
import { SendOrderController } from "../controllers/order/SendOrderController";
import { ListOrdersController } from "../controllers/order/ListOrdersController";
import { DetailOrderController } from "../controllers/order/DetailOrderController";
import { FinishOrderController } from "../controllers/order/FinishOrderController";
import { UpdateOrderStatusController } from "../controllers/order/UpdateOrderStatusController";
import { ListOrderProductsController } from "../controllers/order/ListOrderProductsController";
import { UpdateOrderProductStatusController } from "../controllers/order/UpdateOrderProductStatusController";
import { ListOrdersByTableController } from "../controllers/order/ListOrdersByTableController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkPermission } from "../middlewares/checkPermission";

const orderRoutes = Router();

orderRoutes.post(
  "/order", 
  isAuthenticated, 
  checkPermission('Orders', 'CREATE'),
  new CreateOrderController().handle
);

orderRoutes.get(
  "/orders", 
  isAuthenticated, 
  checkPermission('Orders', 'READ'),
  new ListOrdersController().handle
);

orderRoutes.get(
  "/order/detail", 
  isAuthenticated, 
  checkPermission('Orders', 'READ'),
  new DetailOrderController().handle
);

orderRoutes.delete(
  "/order", 
  isAuthenticated, 
  checkPermission('Orders', 'DELETE'),
  new DeleteOrderController().handle
);

orderRoutes.post(
  "/order/item", 
  isAuthenticated, 
  checkPermission('OrderItems', 'CREATE'),
  new AddItemController().handle
);

orderRoutes.delete(
  "/order/item", 
  isAuthenticated, 
  checkPermission('OrderItems', 'DELETE'),
  new DeleteItemController().handle
);

orderRoutes.put(
  "/order/send", 
  isAuthenticated, 
  checkPermission('Orders', 'UPDATE'),
  new SendOrderController().handle
);

orderRoutes.put(
  "/order/finish", 
  isAuthenticated, 
  checkPermission('Orders', 'UPDATE'),
  new FinishOrderController().handle
);

orderRoutes.put(
  "/order/status", 
  isAuthenticated, 
  checkPermission('OrderStatus', 'UPDATE'),
  new UpdateOrderStatusController().handle
);

orderRoutes.get(
  "/order-products", 
  isAuthenticated, 
  checkPermission('Orders', 'READ'),
  new ListOrderProductsController().handle
);

orderRoutes.put(
  "/order-product/status", 
  isAuthenticated, 
  checkPermission('OrderStatus', 'UPDATE'),
  new UpdateOrderProductStatusController().handle
);

// ✅ Nova rota: Lista orders agrupados por mesa
orderRoutes.get(
  "/orders-by-table", 
  isAuthenticated, 
  checkPermission('Orders', 'READ'),
  new ListOrdersByTableController().handle
);

export { orderRoutes };
