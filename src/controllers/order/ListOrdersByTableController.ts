import { Request, Response } from "express";
import { ListOrdersByTableService } from "../../services/order/ListOrdersByTableService";

class ListOrdersByTableController {
  async handle(req: Request, res: Response) {
    const listOrdersByTableService = new ListOrdersByTableService();

    const tables = await listOrdersByTableService.execute();

    return res.json(tables);
  }
}

export { ListOrdersByTableController };
