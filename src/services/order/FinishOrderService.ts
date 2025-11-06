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
        tables: true,
      },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (!order.orderProducts || order.orderProducts.length === 0) {
      throw new Error("Não é possível finalizar um pedido sem itens");
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

    const allTableOrders = await prismaClient.order.findMany({
      where: {
        tableId: order.tableId,
        orderStatusId: { not: statusFinalizado.id },
      },
      include: {
        orderProducts: true,
      },
    });

    const orderFinished = await prismaClient.$transaction(async (prisma) => {

      for (const tableOrder of allTableOrders) {

        await prisma.orderProduct.updateMany({
          where: {
            orderId: tableOrder.id,
          },
          data: {
            statusId: statusFinalizado.id,
          },
        });

        await prisma.order.update({
          where: { id: tableOrder.id },
          data: {
            orderStatusId: statusFinalizado.id,
            userUpdateId,
          },
        });
      }

      await prisma.table.update({
        where: { id: order.tableId },
        data: { available: true },
      });

      const updatedOrder = await prisma.order.findUnique({
        where: { id: orderId },
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
              status: true,
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

      return updatedOrder;
    });

    return orderFinished;
  }
}

export { FinishOrderService };