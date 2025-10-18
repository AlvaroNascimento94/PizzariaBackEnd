import prismaClient from "../../prisma";

interface IFinishOrder {
  orderId: string;
  userUpdateId: string; 
}

class FinishOrderService {
  async execute({ orderId, userUpdateId }: IFinishOrder) {

    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: true,
        payments: true,
      },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (!order.orderProducts || order.orderProducts.length === 0) {
      throw new Error("Não é possível finalizar um pedido sem itens");
    }

    if (order.draft) {
      throw new Error(
        "Não é possível finalizar um pedido em rascunho. Envie o pedido para a cozinha primeiro."
      );
    }

    const statusFinalizado = await prismaClient.orderStatus.findFirst({
      where: { name: "Finalizado" },
    });

    if (!statusFinalizado) {
      throw new Error(
        "Status 'Finalizado' não encontrado. Execute o seed do banco."
      );
    }

    if (order.orderStatusId === statusFinalizado.id) {
      throw new Error("Este pedido já está finalizado");
    }

    const orderFinished = await prismaClient.$transaction(async (prisma) => {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          orderStatusId: statusFinalizado.id,
          userUpdateId,
        },
        include: {
          tables: true,
          orderStatus: true,
          waiter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderProducts: {
            include: {
              product: true,
            },
          },
          payments: {
            include: {
              paymentType: true,
              paymentStatus: true,
            },
          },
        },
      });

      await prisma.table.update({
        where: { id: order.tableId },
        data: { available: true },
      });

      return updatedOrder;
    });

    return orderFinished;
  }
}

export { FinishOrderService };