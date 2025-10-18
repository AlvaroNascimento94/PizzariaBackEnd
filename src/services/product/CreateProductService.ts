import prismaClient from "../../prisma";

interface IProduct {
  name: string;
  price: number;
  description: string;
  banner: string;
  categoryId: string;
  status?: boolean; 
  userCreateId: string; 
}

class CreateProductService {
  async execute({
    name,
    price,
    description,
    banner,
    categoryId,
    status = true,
    userCreateId,
  }: IProduct) {

    if (!name || !name.trim()) {
      throw new Error("Nome do produto é obrigatório");
    }

    if (!price || price <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }

    if (!categoryId) {
      throw new Error("Categoria é obrigatória");
    }

    if (!banner || !banner.trim()) {
      throw new Error("Banner (imagem) é obrigatório");
    }

    const category = await prismaClient.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    const product = await prismaClient.product.create({
      data: {
        name: name.trim(),
        price,
        description: description?.trim() || "",
        banner,
        categoryId,
        status, 
        userCreateId,
        userUpdateId: userCreateId, 
      },
      include: {
      },
    });

    return product;
  }
}

export { CreateProductService };
