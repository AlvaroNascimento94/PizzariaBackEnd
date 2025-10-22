import prismaClient from "../../prisma";

class ListOrderProductsService {
  async execute() {
    
    const orderProducts = await prismaClient.orderProduct.findMany({
      where: {
        status: {
          name: {
            notIn: ['Finalizado', 'Cancelado']
          }
        }
      },
      include: {
        product: true,
        status: true,
        order: {
          include: {
            tables: true,
            waiter: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return orderProducts;
  }
}

export { ListOrderProductsService };
