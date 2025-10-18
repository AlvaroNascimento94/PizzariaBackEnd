import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkPermission } from "../middlewares/checkPermission";
import { ListByTableController } from "../controllers/table/ListTableController";


const tableRoutes = Router()

tableRoutes.get(
  "/tables",
  isAuthenticated,
  checkPermission('Tables', 'READ'),
  new ListByTableController().handle
);