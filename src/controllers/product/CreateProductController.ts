import { Response, Request } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
  async handle(req: Request, res: Response) {
    const productService = new CreateProductService();

    const { name, price, description, categoryId } = req.body;

    const priceNumber = parseFloat(price);
    const banner = req.file?.filename;

    const product = await productService.execute({
      name,
      price: priceNumber,
      description,
      banner,
      categoryId,
      userCreateId: req.userId,
    });
    return res.json(product);
  }
}

export { CreateProductController };
