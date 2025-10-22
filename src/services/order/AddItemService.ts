import prismaClient from "../../prisma";

interface IAddItem {
  orderId: string;
  productId: string;
  quantity: number;
  description?: string;
}

class AddItemService {
  async execute({ orderId, productId, quantity, description }: IAddItem) {

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

    const statusAguardando = await prismaClient.orderStatus.findFirst({
      where: { name: "Aguardando" },
    });

    if (!statusAguardando) {
      throw new Error("Status 'Aguardando' não encontrado. Execute o seed do banco.");
    }

    const orderProduct = await prismaClient.orderProduct.create({
      data: {
        orderId,
        productId,
        quantity,
        description,
        statusId: statusAguardando.id,
      },
      include: {
        product: true,
        status: true,
      },
    });

    return orderProduct;
  }
}
export { AddItemService };
