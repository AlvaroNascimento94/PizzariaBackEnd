import prismaClient from "../../prisma";
interface IGetProduct {
  id: string;
}

class GetProductService {
  async execute({ id }: IGetProduct) {
    const product = await prismaClient.product.findUnique({
      where: { id },
    });
    
     if (!product) {
      throw new Error("Produto não encontrado");
    }

    return product;
  }
}

export { GetProductService };