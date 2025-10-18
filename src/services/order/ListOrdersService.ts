import prismaClient from "../../prisma";

class ListOrdersService {
  async execute() {

    const orders = await prismaClient.order.findMany({
      where: {
        draft: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tables: true,
        orderStatus: true,
        waiter: {
          select: {
            name: true,
            email: true,
          },
        },
        orderProducts: {
          include: {
            product: true,
          },
        }
      },
    });

    return orders;
  }
}

export { ListOrdersService };