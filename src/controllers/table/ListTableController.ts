import { Request, Response } from "express";
import { ListByTableService } from "../../services/table/ListByTableService";

class ListByTableController {
  async handle(req:Request, res:Response) {
    const service = new ListByTableService();
    const result = await service.execute();
    return res.json(result);
  }
}

export { ListByTableController };