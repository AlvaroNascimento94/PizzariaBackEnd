import prismaClient from "../../prisma";

interface ISendOrder {
  orderId: string;
  userUpdateId: string;
}

class SendOrderService {
  async execute({ orderId, userUpdateId }: ISendOrder) {

    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: true,
      },
    });
    const orderProducts = prismaClient.orderProduct.findMany({
      where: { orderId: orderId },
      include: {
        product: true,
      },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (!order.orderProducts || order.orderProducts.length === 0) {
      throw new Error("Não é possível enviar um pedido sem itens");
    }

    const orderProductsWithDetails = await orderProducts;
    const totalPrice = orderProductsWithDetails.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    if (!order.draft) {
      throw new Error("Este pedido já foi enviado para a cozinha");
    }

    const statusIniciado = await prismaClient.orderStatus.findFirst({
      where: { name: "Iniciado" },
    });

    if (!statusIniciado) {
      throw new Error(
        "Status 'Iniciado' não encontrado. Execute o seed do banco."
      );
    }

    const orderUpdated = await prismaClient.order.update({
      where: { id: orderId },
      data: {
        orderStatusId: statusIniciado.id,
        draft: false,
        price: totalPrice,
        userUpdateId,
        updatedAt: new Date(Date.now()),
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
      },
    });

    return orderUpdated;
  }
}

export { SendOrderService };
