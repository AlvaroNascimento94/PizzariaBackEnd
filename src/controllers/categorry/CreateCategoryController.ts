import { Request, Response } from "express";
import { CreateCategoryService } from "../../services/catergory/CreateCategoryService";

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    const categoryService = new CreateCategoryService();

    const { name } = req.body;

    const cantegory = await categoryService.execute({ name });

    return res.json(cantegory);
  }
}
export { CreateCategoryController };
