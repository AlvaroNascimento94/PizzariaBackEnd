import { Request, Response } from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.body;
    const userId = req.userId;

    const finishService = new FinishOrderService();

    const order = await finishService.execute({ 
      orderId,
      userUpdateId: userId,
    });

    return res.json(order);
  }
}

export { FinishOrderController };
