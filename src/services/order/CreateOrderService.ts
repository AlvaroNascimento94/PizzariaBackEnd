import prismaClient from "../../prisma";

interface IOrder {
  tableId: string;
  userCreateId: string; 
}

class CreateOrderService {
  async execute({ tableId, userCreateId }: IOrder) {
    const table = await prismaClient.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new Error("Mesa não encontrada");
    }

    if (!table.available) {
      throw new Error("Mesa está ocupada");
    }

    const orderExist = await prismaClient.order.findFirst({
      where: {
        tableId,
        draft: true,
      },
    });

    if (orderExist) {
      throw new Error("Já existe um pedido em aberto para esta mesa");
    }

    const statusAguardando = await prismaClient.orderStatus.findFirst({
      where: { name: "Aguardando" },
    });

    if (!statusAguardando) {
      throw new Error("Status 'Aguardando' não encontrado. Execute o seed do banco.");
    }

    const waiter = await prismaClient.user.findUnique({
      where: { id: userCreateId },
    });

    if (!waiter) {
      throw new Error("Garçom não encontrado");
    }

    const order = await prismaClient.$transaction(async (prisma) => {
      await prisma.table.update({
        where: { id: tableId },
        data: { available: false }, // ✅ Mesa ocupada
      });

      const newOrder = await prisma.order.create({
        data: {
          tableId,
          orderStatusId: statusAguardando.id,
          waiterId: userCreateId,
          userCreateId,
          userUpdateId: userCreateId,
          draft: true,
          price: 0,
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
        },
      });

      return newOrder;
    });

    return order;
  }
}

export { CreateOrderService };
