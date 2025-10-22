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
          statusPriority: 0,
          allOrderProducts: []
        };
      }

      acc[tableId].orders.push(order);
      acc[tableId].totalPrice += order.price;
      
      // ✅ Coleta todos os OrderProducts da mesa
      acc[tableId].allOrderProducts.push(...order.orderProducts);

      // Mantém a data da ordem mais antiga
      if (new Date(order.createdAt) < new Date(acc[tableId].oldestOrderDate)) {
        acc[tableId].oldestOrderDate = order.createdAt;
      }

      return acc;
    }, {});

    // ✅ Calcula o status mais avançado baseado nos OrderProducts
    return Object.values(groupedByTable).map((group: any) => {
      let mostAdvancedStatus = 'Aguardando';
      let highestPriority = 0;

      // ✅ Conta itens por status
      const itemsByStatus = {
        aguardando: 0,
        emPreparo: 0,
        pronto: 0,
        entregue: 0,
        finalizado: 0,
        cancelado: 0
      };

      // Percorre todos os OrderProducts da mesa
      group.allOrderProducts.forEach((item: any) => {
        const itemPriority = this.getStatusPriority(item.status.name);
        if (itemPriority > highestPriority) {
          highestPriority = itemPriority;
          mostAdvancedStatus = item.status.name;
        }

        // Conta por status
        const statusName = item.status.name;
        if (statusName === 'Aguardando') itemsByStatus.aguardando++;
        else if (statusName === 'Em Preparo') itemsByStatus.emPreparo++;
        else if (statusName === 'Pronto') itemsByStatus.pronto++;
        else if (statusName === 'Entregue') itemsByStatus.entregue++;
        else if (statusName === 'Finalizado') itemsByStatus.finalizado++;
        else if (statusName === 'Cancelado') itemsByStatus.cancelado++;
      });

      return {
        tableId: group.tableId,
        tableName: group.tableName,
        totalOrders: group.orders.length,
        totalPrice: group.totalPrice,
        createdAt: group.oldestOrderDate,
        status: mostAdvancedStatus,
        statusPriority: highestPriority,
        itemsByStatus,
        orders: group.orders
      };
    }).sort((a: any, b: any) => {
      // ✅ Ordenação: Primeiro por prioridade de status (DESC), depois por nome da mesa (ASC)
      if (b.statusPriority !== a.statusPriority) {
        return b.statusPriority - a.statusPriority;
      }
      return a.tableName.localeCompare(b.tableName);
    });
  }

  private getStatusPriority(statusName: string): number {
    const priorities: Record<string, number> = {
      'Aguardando': 1,
      'Em Preparo': 2,
      'Pronto': 3,
      'Entregue': 4,
      'Finalizado': 5
    };
    return priorities[statusName] || 0;
  }
}

export { ListOrdersByTableService };
