import prismaClient from "../../prisma";

interface IDeleteOrder {
  orderId: string;
}

class DeleteOrderService {
  async execute({ orderId }: IDeleteOrder) {

    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: true,
        payments: true,
        orderStatus: true,
      },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (!order.draft) {
      throw new Error(
        "Não é possível deletar um pedido já enviado para a cozinha. Apenas pedidos em rascunho podem ser removidos."
      );
    }

    if (order.payments && order.payments.length > 0) {
      throw new Error(
        "Não é possível deletar um pedido que possui pagamentos registrados"
      );
    }

    const deletedOrder = await prismaClient.order.delete({
      where: {
        id: orderId,
      },
    });

    return deletedOrder;
  }
}

export { DeleteOrderService };
