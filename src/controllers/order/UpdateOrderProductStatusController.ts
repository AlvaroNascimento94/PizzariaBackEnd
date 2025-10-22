import { Request, Response } from "express";
import { UpdateOrderProductStatusService } from "../../services/order/UpdateOrderProductStatusService";

class UpdateOrderProductStatusController {
  async handle(req: Request, res: Response) {
    const { orderProductId, statusName } = req.body as {
      orderProductId: string;
      statusName: 'Iniciado' | 'Aguardando' | 'Em Preparo' | 'Pronto' | 'Entregue' | 'Finalizado' | 'Cancelado';
    };

    if (!orderProductId || !statusName) {
      return res.status(400).json({ error: "orderProductId e statusName são obrigatórios" });
    }

    const updateOrderProductStatusService = new UpdateOrderProductStatusService();

    const orderProduct = await updateOrderProductStatusService.execute({
      orderProductId,
      statusName
    });

    return res.json(orderProduct);
  }
}

export { UpdateOrderProductStatusController };
