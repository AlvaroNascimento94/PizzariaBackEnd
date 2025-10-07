import { Request, Response } from "express";
import { DetailOrderService } from "../../services/order/DetailOrderService";

class DetailOrderController {
  async handle(req: Request, res: Response) {
    try {
      const id = req.query.orderId as string;

      if (!id) {
        return res.status(400).json({ 
          error: "OrderId é obrigatório" 
        });
      }

      const detailOrderService = new DetailOrderService();
      const orders = await detailOrderService.execute({ id });

      return res.json(orders);
    } catch (error) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
  }
}
export { DetailOrderController };
