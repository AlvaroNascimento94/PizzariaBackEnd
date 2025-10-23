import { Response, Request } from "express";
import { GetProductService } from "../../services/product/GetProductService";

class GetProductController {
  async handle(req: Request, res: Response) {
    const { productId } = req.params;

    const getProductService = new GetProductService();

    const product = await getProductService.execute({ id: productId });

    return res.json(product);
  }
}

export { GetProductController };
