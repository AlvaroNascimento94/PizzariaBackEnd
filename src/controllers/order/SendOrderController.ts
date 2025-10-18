import { Response, Request } from "express";
import { SendOrderService } from "../../services/order/SendOrderService";

class SendOrderController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.body;
    const userId = req.userId;

    const sendOrder = new SendOrderService();

    const order = await sendOrder.execute({ 
      orderId,
      userUpdateId: userId,
    });

    return res.json(order);
  }
}

export { SendOrderController };
