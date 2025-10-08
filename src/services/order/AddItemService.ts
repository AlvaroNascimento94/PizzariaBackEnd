import prismaClient from "../../prisma";

interface IAddItem {
  orderId: string;
  productId: string;
  amount: number;
}

class AddItemService {
  async execute({ orderId, productId, amount }: IAddItem) {
    const existingItem = await prismaClient.item.findFirst({
      where: {
        orderId: orderId,
        productId: productId,
      },
    });

    let order;

    if (existingItem) {
      order = await prismaClient.item.update({
        where: {
          id: existingItem.id,
        },
        data: {
          amount: existingItem.amount + amount,
        },
      });
    } else {
      order = await prismaClient.item.create({
        data: {
          orderId,
          productId,
          amount,
        },
      });
    }

    return order;
  }
}
export { AddItemService };
