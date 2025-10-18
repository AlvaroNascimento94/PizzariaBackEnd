import prismaClient from "../../prisma";

interface IDeleteItem {
  itemId: string;
}

class DeleteItemService {
  async execute({ itemId }: IDeleteItem) {

    const item = await prismaClient.orderProduct.findUnique({
      where: { id: itemId },
      include: {
        order: true,
      },
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

    if (!item.order.draft) {
      throw new Error(
        "Não é possível remover itens de um pedido já enviado para a cozinha"
      );
    }

    const deletedItem = await prismaClient.orderProduct.delete({
      where: {
        id: itemId,
      },
    });

    return deletedItem;
  }
}

export { DeleteItemService };