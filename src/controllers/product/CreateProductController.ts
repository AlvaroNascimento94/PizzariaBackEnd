import { Response, Request } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
  async handle(req: Request, res: Response) {
    const productService = new CreateProductService();

    const { name, price, description, categoryId } = req.body;

    // Converter price de string para número
    const priceNumber = parseFloat(price);

    if (!req.file) {
      throw new Error("Erro upload file");
    } else {
      const { originalname, filename: banner } = req.file;

      const product = await productService.execute({
        name,
        price: priceNumber,
        description,
        banner,
        categoryId,
      });
      return res.json(product);
    }
  }
}

export { CreateProductController };
