import { Request, Response } from "express";
import { DetailOrderService } from "../../services/order/DetailOrderService";

class DetailOrderController {
  async handle(req: Request, res: Response) {
    const id = req.query.orderId as string;

    const detailOrderService = new DetailOrderService();
    
    const order = await detailOrderService.execute({ id });

    return res.json(order);
  }
}

export { DetailOrderController };
