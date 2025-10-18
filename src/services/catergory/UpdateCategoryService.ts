import prismaClient from "../../prisma";

interface IUpdateCategory {
  categoryId: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

class UpdateCategoryService {
  async execute({ categoryId, name, description, color, icon }: IUpdateCategory) {

    if (!categoryId || !categoryId.trim()) {
      throw new Error("ID da categoria é obrigatório");
    }

    const categoryExists = await prismaClient.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      throw new Error("Categoria não encontrada");
    }

    const dataToUpdate: any = {};

    if (name !== undefined) {
      if (!name.trim()) {
        throw new Error("Nome da categoria não pode ser vazio");
      }
      dataToUpdate.name = name.trim();
    }

    if (description !== undefined) {
      dataToUpdate.description = description?.trim() || null;
    }

    if (color !== undefined) {
      dataToUpdate.color = color || null;
    }

    if (icon !== undefined) {
      dataToUpdate.icon = icon || null;
    }

    dataToUpdate.updatedAt = new Date(Date.now());

    const categoryUpdated = await prismaClient.category.update({
      where: { id: categoryId },
      data: dataToUpdate,
    });

    return categoryUpdated;
  }
}

export { UpdateCategoryService };
