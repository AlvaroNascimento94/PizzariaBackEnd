import prismaClient from "../../prisma";

interface IOrderItem {
  productId: string;
  quantity: number;
  description?: string;
}

interface IOrder {
  tableId: string;
  userCreateId: string;
  items?: IOrderItem[];
}

class CreateOrderService {
  async execute({ tableId, userCreateId, items = [] }: IOrder) {
    const table = await prismaClient.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new Error("Mesa não encontrada");
    }

    // ✅ Verifica se já existe pedido em aberto (não finalizado/cancelado) nesta mesa
    const hasOpenOrders = await prismaClient.order.findFirst({
      where: {
        tableId,
        orderStatus: {
          name: {
            notIn: ['Finalizado', 'Cancelado']
          }
        }
      },
    });

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
    
    if (items.length > 0) {
      const productIds = items.map(item => item.productId);
      const products = await prismaClient.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new Error("Um ou mais produtos não foram encontrados");
      }

      const totalPrice = items.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + (product ? parseFloat(product.price.toString()) * item.quantity : 0);
      }, 0);

      const order = await prismaClient.$transaction(async (prisma) => {
        // ✅ Só marca mesa como ocupada se for o primeiro pedido
        if (!hasOpenOrders) {
          await prisma.table.update({
            where: { id: tableId },
            data: { available: false },
          });
        }

        const newOrder = await prisma.order.create({
          data: {
            tableId,
            orderStatusId: statusAguardando.id,
            waiterId: userCreateId,
            userCreateId,
            userUpdateId: userCreateId,
            price: totalPrice,
          },
        });


        // ✅ Cria todos os itens de uma vez com status "Aguardando"
        await prisma.orderProduct.createMany({
          data: items.map(item => ({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            description: item.description || null,
            statusId: statusAguardando.id, // ✅ Define status do item
          })),
        });

        const orderComplete = await prisma.order.findUnique({
          where: { id: newOrder.id },
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

        return orderComplete;
      });

      return order;
    }

    const order = await prismaClient.$transaction(async (prisma) => {
      // ✅ Só marca mesa como ocupada se for o primeiro pedido
      if (!hasOpenOrders) {
        await prisma.table.update({
          where: { id: tableId },
          data: { available: false },
        });
      }

      const newOrder = await prisma.order.create({
        data: {
          tableId,
          orderStatusId: statusAguardando.id,
          waiterId: userCreateId,
          userCreateId,
          userUpdateId: userCreateId,
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
