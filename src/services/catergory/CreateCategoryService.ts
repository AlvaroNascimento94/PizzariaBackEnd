import prismaClient from "../../prisma";

interface ICategory {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

class CreateCategoryService {
  async execute({ name, description, color, icon }: ICategory) {
    if (!name || !name.trim()) {
      throw new Error("Nome da categoria é obrigatório");
    }

    const category = await prismaClient.category.create({
      data: {
        name: name.trim(),
        description: description ? description : null,
        color: color || null,
        icon: icon || null,
      },
    });

    return category;
  }
}

export { CreateCategoryService };
