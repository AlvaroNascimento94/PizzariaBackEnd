import { Request, Response } from "express";
import { DetailCategoryService } from "../../services/catergory/DetailCategoryService";

class DetailCategoryController {
  async handle(req: Request, res: Response) {
    const { categoryId } = req.params;

    const detailCategoryService = new DetailCategoryService();

    const category = await detailCategoryService.execute({
      categoryId: categoryId ,
    });

    return res.json(category);
  }
}

export { DetailCategoryController };
