import { Request, Response } from "express";
import { UpdateCategoryService } from "../../services/catergory/UpdateCategoryService";

class UpdateCategoryController {
  async handle(req: Request, res: Response) {
    const { name, description, color, icon } = req.body;
    const { categoryId } = req.params;

    const updateCategoryService = new UpdateCategoryService();

    const category = await updateCategoryService.execute({
      categoryId,
      name,
      description,
      color,
      icon,
    });

    return res.json(category);
  }
}

export { UpdateCategoryController };
