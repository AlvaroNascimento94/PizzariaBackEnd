import { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/CreateOrderService";

class CreateOrderController {
  async handle(req: Request, res: Response) {
    const { tableId } = req.body;
    const userCreateId = req.userId;

    const createOrderService = new CreateOrderService();

    const order = await createOrderService.execute({ 
      tableId, 
      userCreateId 
    });

    return res.json(order);
  }
}

export { CreateOrderController };
