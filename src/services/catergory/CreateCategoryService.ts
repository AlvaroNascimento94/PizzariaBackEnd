import prismaClient from "../../prisma";

interface ICategory {
  name: string;
}

class CreateCategoryService {
  async execute({ name }: ICategory) {
    if (name === "") throw new Error("Name Invalid");

    const category = await prismaClient.category.create({
        data:{
            name
        },
        select:{
            id:true,
            name:true
        }
    })
    return category;
  }
}

export { CreateCategoryService };
