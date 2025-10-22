import prismaClient from "../../prisma";

interface UpdateOrderProductStatusRequest {
  orderProductId: string;
  statusName: 'Aguardando' | 'Em Preparo' | 'Pronto' | 'Entregue' | 'Finalizado' | 'Cancelado';
}

class UpdateOrderProductStatusService {
  async execute({ orderProductId, statusName }: UpdateOrderProductStatusRequest) {

    const orderProduct = await prismaClient.orderProduct.findUnique({
      where: { id: orderProductId },
      include: {
        status: true,
        order: true,
      }
    });

    if (!orderProduct) {
      throw new Error('Item do pedido não encontrado');
    }

    const newStatus = await prismaClient.orderStatus.findFirst({
      where: { name: statusName }
    });

    if (!newStatus) {
      throw new Error(`Status '${statusName}' não encontrado`);
    }

    const currentStatus = orderProduct.status.name;


    const validTransitions: Record<string, string[]> = {
      'Aguardando': ['Em Preparo', 'Cancelado'],
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

    const updatedOrderProduct = await prismaClient.$transaction(async (prisma) => {
      const updated = await prisma.orderProduct.update({
        where: { id: orderProductId },
        data: {
          statusId: newStatus.id,
        },
        include: {
          status: true,
          product: true,
          order: {
            include: {
              tables: true,
              waiter: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          }
        }
      });

      if (statusName === 'Finalizado' || statusName === 'Cancelado') {
        const otherItems = await prisma.orderProduct.findMany({
          where: {
            order: {
              tableId: orderProduct.order.tableId
            },
            id: { not: orderProductId },
            status: {
              name: {
                notIn: ['Finalizado', 'Cancelado']
              }
            }
          },
        });

        if (otherItems.length === 0) {
          await prisma.table.update({
            where: { id: orderProduct.order.tableId },
            data: { available: true },
          });
        }
      }

      return updated;
    });

    return updatedOrderProduct;
  }
}

export { UpdateOrderProductStatusService };
