import { Response, Request } from "express";
import { ListByCatergoryService } from "../../services/product/ListByCategoryService";

class ListByCatergoryController {
  async handle(req: Request, res: Response) {
    const listByCategory = new ListByCatergoryService();
    const categoryId  = req.query.categoryId as string;

    const list = await listByCategory.execute( {categoryId} );

    return res.json(list);
  }
}
export { ListByCatergoryController };
