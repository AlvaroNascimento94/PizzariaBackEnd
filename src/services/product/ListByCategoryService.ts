import prismaClient from "../../prisma";
interface IProductId {
  categoryId: string;
}

class ListByCatergoryService {
  async execute({ categoryId }: IProductId) {
    const findCatergory = await prismaClient.product.findMany({
      where: {
        categoryId
      },
    });
    return findCatergory;
  }
}

export { ListByCatergoryService };
