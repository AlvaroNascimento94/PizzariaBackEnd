import prismaClient from "../../prisma";

class ListOrdersByTableService {
  async execute() {
    // Busca todos os Orders que não estão Finalizados ou Cancelados
    const orders = await prismaClient.order.findMany({
      where: {
        orderStatus: {
          name: {
            notIn: ['Finalizado', 'Cancelado']
          }
        }
      },
      include: {
        tables: true,
        orderStatus: true,
        orderProducts: {
          include: {
            product: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Agrupa por mesa
    const groupedByTable = orders.reduce((acc: any, order) => {
      const tableId = order.tableId;
      
      if (!acc[tableId]) {
        acc[tableId] = {
          tableId: tableId,
          tableName: order.tables.name,
          orders: [],
          totalPrice: 0,
          oldestOrderDate: order.createdAt,
          status: order.orderStatus.name,
          statusPriority: this.getStatusPriority(order.orderStatus.name)
        };
      }

      acc[tableId].orders.push(order);
      acc[tableId].totalPrice += order.price;

      // Mantém a data da ordem mais antiga
      if (new Date(order.createdAt) < new Date(acc[tableId].oldestOrderDate)) {
        acc[tableId].oldestOrderDate = order.createdAt;
      }

      // Atualiza para o status mais avançado
      const orderPriority = this.getStatusPriority(order.orderStatus.name);
      if (orderPriority > acc[tableId].statusPriority) {
        acc[tableId].status = order.orderStatus.name;
        acc[tableId].statusPriority = orderPriority;
      }

      return acc;
    }, {});

    // Converte para array e retorna
    return Object.values(groupedByTable).map((group: any) => ({
      tableId: group.tableId,
      tableName: group.tableName,
      totalOrders: group.orders.length,
      totalPrice: group.totalPrice,
      createdAt: group.oldestOrderDate,
      status: group.status,
      orders: group.orders
    }));
  }

  private getStatusPriority(statusName: string): number {
    const priorities: Record<string, number> = {
      'Aguardando': 1,
      'Iniciado': 2,
      'Em Preparo': 3,
      'Pronto': 4,
      'Entregue': 5
    };
    return priorities[statusName] || 0;
  }
}

export { ListOrdersByTableService };
