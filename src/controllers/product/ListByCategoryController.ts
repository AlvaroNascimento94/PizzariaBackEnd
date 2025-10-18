import { Response, Request } from "express";
import { ListByCatergoryService } from "../../services/product/ListByCategoryService";

class ListByCatergoryController {
  async handle(req: Request, res: Response) {

    const listByCategory = new ListByCatergoryService();

    const list = await listByCategory.execute( );

    return res.json(list);
  }
}
export { ListByCatergoryController };
