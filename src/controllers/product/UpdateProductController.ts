import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";

class UpdateProductController {
  async handle(req: Request, res: Response) {
    const { productId, name, price, description, status } = req.body;
    const userId = req.userId;

    const updateProductService = new UpdateProductService();

    const product = await updateProductService.execute({
      productId,
      name,
      price: price ? parseFloat(price) : undefined,
      description,
      status: status !== undefined ? status === true || status === 'true' : undefined,
      userUpdateId: userId,
    });

    return res.json(product);
  }
}

export { UpdateProductController };
