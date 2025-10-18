import { Response, Request } from "express";
import { AddItemService } from "../../services/order/AddItemService";

class AddItemController {
  async handle(req: Request, res: Response) {
    const { orderId, productId, quantity } = req.body;

    const addItem = new AddItemService();

    const order = await addItem.execute({ 
      orderId, 
      productId, 
      quantity
    });

    return res.json(order);
  }
}

export { AddItemController };