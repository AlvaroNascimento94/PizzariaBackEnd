import prismaClient from "../../prisma";

interface UpdateOrderStatusRequest {
  orderId: string;
  statusName: 'Iniciado' | 'Aguardando' | 'Em Preparo' | 'Pronto' | 'Entregue' | 'Finalizado' | 'Cancelado';
}

class UpdateOrderStatusService {
  async execute({ orderId, statusName }: UpdateOrderStatusRequest) {

    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: {
        orderStatus: true,
      }
    });

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    const newStatus = await prismaClient.orderStatus.findFirst({
      where: { name: statusName }
    });

    if (!newStatus) {
      throw new Error(`Status '${statusName}' não encontrado`);
    }

    const currentStatus = order.orderStatus.name;

    const validTransitions: Record<string, string[]> = {
      'Aguardando': ['Iniciado', 'Cancelado'],
      'Iniciado': ['Em Preparo', 'Cancelado'],
      'Em Preparo': ['Pronto', 'Cancelado'],
      'Pronto': ['Entregue', 'Cancelado'],
      'Entregue': ['Finalizado', 'Cancelado'],
      'Finalizado': [],
      'Cancelado': []
    };

    if (!validTransitions[currentStatus]?.includes(statusName)) {
      throw new Error(
        `Não é possível mudar de '${currentStatus}' para '${statusName}'`
      );
    }

    const updatedOrder = await prismaClient.$transaction(async (prisma) => {
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          orderStatusId: newStatus.id,
        },
        include: {
          orderStatus: true,
          tables: true,
          orderProducts: {
            include: {
              product: true,
            }
          }
        }
      });

      // ✅ Se finalizou ou cancelou, verifica se pode liberar a mesa
      if (statusName === 'Finalizado' || statusName === 'Cancelado') {
        const otherOrders = await prisma.order.findMany({
          where: {
            tableId: order.tableId,
            id: { not: orderId },
            orderStatus: {
              name: {
                notIn: ['Finalizado', 'Cancelado']
              }
            }
          },
        });

        // ✅ Só libera a mesa se NÃO houver outros pedidos em aberto
        if (otherOrders.length === 0) {
          await prisma.table.update({
            where: { id: order.tableId },
            data: { available: true },
          });
        }
      }

      return updated;
    });

    return updatedOrder;
  }
}

export { UpdateOrderStatusService };
