import { Request, Response } from "express";
import { DetailCategoryService } from "../../services/catergory/DetailCategoryService";

class DetailCategoryController {
  async handle(req: Request, res: Response) {
    const { categoryId } = req.query;

    const detailCategoryService = new DetailCategoryService();

    const category = await detailCategoryService.execute({
      categoryId: categoryId as string,
    });

    return res.json(category);
  }
}

export { DetailCategoryController };
