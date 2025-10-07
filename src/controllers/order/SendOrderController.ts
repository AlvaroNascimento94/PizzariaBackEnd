import { Response, Request } from "express";
import { SendOrderService } from "../../services/order/SendOrdetrService";

class SendOrderController {
  async handle(req: Request, res: Response) {
    const { id } = req.body;

    const sendOrder = new SendOrderService();

    const order = await sendOrder.execute({ id });

    return res.json(order)
  }
}

export { SendOrderController };
