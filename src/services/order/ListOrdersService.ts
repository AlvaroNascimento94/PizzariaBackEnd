import prismaClient from "../../prisma";

class ListOrdersService {
  async execute() {

    const orders = await prismaClient.order.findMany({
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