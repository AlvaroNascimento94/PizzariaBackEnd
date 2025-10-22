import { Request, Response } from "express";
import { ListOrderProductsService } from "../../services/order/ListOrderProductsService";

class ListOrderProductsController {
  async handle(req: Request, res: Response) {
    const listOrderProductsService = new ListOrderProductsService();
    
    const orderProducts = await listOrderProductsService.execute();
    
    return res.json(orderProducts);
  }
}

export { ListOrderProductsController };
