import prismaClient from "../../prisma";

interface IDetailOrder {
  id: string;
}

class DetailOrderService {
  async execute({ id }: IDetailOrder) {
    const orders = await prismaClient.item.findMany({
      where: {
        orderId: id,
      },
      include:{
        product:true,
        order: true
      }
    });
    
    if(!orders || orders.length === 0) {
      throw new Error("Não existem itens para esta mesa/pedido");
    }
    
    return orders;
  }
}

export { DetailOrderService };
