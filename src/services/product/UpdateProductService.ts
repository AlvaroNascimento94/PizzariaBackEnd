import prismaClient from "../../prisma";

interface IUpdateProduct {
  productId: string;
  name?: string;
  price?: number;
  description?: string;
  status?: boolean;
  userUpdateId: string;
}

class UpdateProductService {
  async execute({
    productId,
    name,
    price,
    description,
    status,
    userUpdateId,
  }: IUpdateProduct) {

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    if (name !== undefined) {
      if (!name.trim()) {
        throw new Error("Nome do produto não pode ser vazio");
      }
    }

    if (price !== undefined) {
      if (price <= 0) {
        throw new Error("Preço deve ser maior que zero");
      }
    }

    const dataToUpdate: any = {
      userUpdateId, 
    };

    if (name !== undefined) {
      dataToUpdate.name = name.trim();
    }

    if (price !== undefined) {
      dataToUpdate.price = price;
    }

    if (description !== undefined) {
      dataToUpdate.description = description.trim();
    }

    if (status !== undefined) {
      dataToUpdate.status = status;
    }
    const updatedProduct = await prismaClient.product.update({
      where: { id: productId },
      data: dataToUpdate,
      include: {
        category: true,
      }
    });

    return updatedProduct;
  }
}

export { UpdateProductService };
