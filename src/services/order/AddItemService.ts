import prismaClient from "../../prisma";

interface IAddItem {
  orderId: string;
  productId: string;
  quantity: number;
}

class AddItemService {
  async execute({ orderId, productId, quantity }: IAddItem) {

    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    // ✅ Busca o status "Aguardando" para novos itens
    const statusAguardando = await prismaClient.orderStatus.findFirst({
      where: { name: "Aguardando" },
    });

    if (!statusAguardando) {
      throw new Error("Status 'Aguardando' não encontrado. Execute o seed do banco.");
    }

    const existingItem = await prismaClient.orderProduct.findFirst({
      where: {
        orderId: orderId,
        productId: productId,
      },
    });

    let orderProduct;

    if (existingItem) {
      orderProduct = await prismaClient.orderProduct.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });
    } else {

      orderProduct = await prismaClient.orderProduct.create({
        data: {
          orderId,
          productId,
          quantity,
          statusId: statusAguardando.id, // ✅ Define status inicial
        },
        include: {
          product: true,
          status: true, // ✅ Inclui status na resposta
        },
      });
    }

    return orderProduct;
  }
}
export { AddItemService };
