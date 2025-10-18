import prismaClient from "../../prisma";

interface IDetailCategory {
  categoryId: string;
}

class DetailCategoryService {
  async execute({ categoryId }: IDetailCategory) {

    if (!categoryId || !categoryId.trim()) {
      throw new Error("ID da categoria é obrigatório");
    }

    const category = await prismaClient.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        icon: true,
        createdAt: true,
        updatedAt: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            status: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    return category;
  }
}

export { DetailCategoryService };
