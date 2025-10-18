import { Response, Request } from "express";
import { DeleteOrderService } from "../../services/order/DeleteOrderService";

class DeleteOrderController {
  async handle(req: Request, res: Response) {
    const orderId = req.query.orderId as string;

    const orderService = new DeleteOrderService();

    const order = await orderService.execute({ orderId });

    return res.json(order);
  }
}

export { DeleteOrderController };