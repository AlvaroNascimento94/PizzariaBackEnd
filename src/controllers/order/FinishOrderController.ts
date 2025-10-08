import { Request, Response } from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController {
  async handle(req: Request, res: Response) {
    const finishService = new FinishOrderService();
    const { id } = req.body;

    const order = await finishService.execute({ id });

    return res.json(order)
  }
}

export { FinishOrderController };
