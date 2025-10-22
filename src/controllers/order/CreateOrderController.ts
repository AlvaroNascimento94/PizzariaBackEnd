import { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/CreateOrderService";

interface IOrderItem {
  productId: string;
  quantity: number;
  description?: string;
}

class CreateOrderController {
  async handle(req: Request, res: Response) {
    const { tableId, items } = req.body as { 
      tableId: string; 
      items?: IOrderItem[];
    };

    if (!tableId) {
      return res.status(400).json({ error: "Mesa é obrigatória" });
    }

    const createOrderService = new CreateOrderService();

    const userCreateId = req.userId!;

    const order = await createOrderService.execute({
      tableId,
      userCreateId,
      items: items || [],
    });

    return res.json(order);
  }
}

export { CreateOrderController };
