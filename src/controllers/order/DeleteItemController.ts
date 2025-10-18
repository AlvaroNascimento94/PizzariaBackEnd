import { Response, Request } from "express";
import { DeleteItemService } from "../../services/order/DeleteItemService";

class DeleteItemController {
  async handle(req: Request, res: Response) {
    const itemId = req.query.itemId as string;

    const deleteItem = new DeleteItemService();

    const result = await deleteItem.execute({ itemId });
    
    return res.json(result);
  }
}

export { DeleteItemController };