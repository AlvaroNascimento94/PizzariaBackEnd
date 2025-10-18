import prismaClient from "../../prisma";

interface UpdateOrderStatusRequest {
  orderId: string;
  statusName: 'Aguardando' | 'Em Preparo' | 'Pronto' | 'Finalizado' | 'Cancelado';
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
      'Aguardando': ['Em Preparo', 'Cancelado'],
      'Em Preparo': ['Pronto', 'Cancelado'],
      'Pronto': ['Finalizado'],
      'Finalizado': [],
      'Cancelado': []
    };

    if (!validTransitions[currentStatus]?.includes(statusName)) {
      throw new Error(
        `Não é possível mudar de '${currentStatus}' para '${statusName}'`
      );
    }

    const updatedOrder = await prismaClient.order.update({
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

    return updatedOrder;
  }
}

export { UpdateOrderStatusService };
