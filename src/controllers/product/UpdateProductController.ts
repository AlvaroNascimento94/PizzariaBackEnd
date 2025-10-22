import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";

class UpdateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, status } = req.body;
    const { productId } = req.params as { productId: string };
    const userId = req.userId;

    const banner = req.file?.filename;

    const updateProductService = new UpdateProductService();

    const product = await updateProductService.execute({
      productId,
      name,
      price: price ? parseFloat(price) : undefined,
      description,
      banner,
      status: status !== undefined ? status === true || status === 'true' : undefined,
      userUpdateId: userId,
    });

    return res.json(product);
  }
}

export { UpdateProductController };
