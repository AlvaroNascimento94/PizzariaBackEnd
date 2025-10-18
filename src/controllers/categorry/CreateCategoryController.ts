import { Request, Response } from "express";
import { CreateCategoryService } from "../../services/catergory/CreateCategoryService";

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    const { name, description, color, icon } = req.body;

    const categoryService = new CreateCategoryService();

    const category = await categoryService.execute({
      name,
      description,
      color,
      icon,
    });

    return res.json(category);
  }
}

export { CreateCategoryController };
