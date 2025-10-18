import prismaClient from "../../prisma";

interface IProductByCategory {
  categoryId: string;
}

class ListByCatergoryService {
  async execute() {
    const products = await prismaClient.product.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id:true,
        name: true,
        description: true,
        price: true,
        status: true,
        categoryId: true,
        banner: true,
      }
    });

    return products;
  }
}

export { ListByCatergoryService };
