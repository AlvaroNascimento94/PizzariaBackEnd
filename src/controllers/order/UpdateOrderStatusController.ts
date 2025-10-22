import { Request, Response } from "express";
import { UpdateOrderStatusService } from "../../services/order/UpdateOrderStatusService";

class UpdateOrderStatusController {
  async handle(req: Request, res: Response) {
    const { orderId, statusName } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: 'orderId é obrigatório'
      });
    }

    if (!statusName) {
      return res.status(400).json({
        error: 'statusName é obrigatório'
      });
    }

    const validStatuses = ['Iniciado', 'Aguardando', 'Em Preparo', 'Pronto', 'Entregue', 'Finalizado', 'Cancelado'];
    if (!validStatuses.includes(statusName)) {
      return res.status(400).json({
        error: 'Status inválido',
        validStatuses
      });
    }

    const updateOrderStatusService = new UpdateOrderStatusService();

    try {
      const order = await updateOrderStatusService.execute({
        orderId,
        statusName
      });

      return res.json(order);
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      return res.status(400).json({
        error: error.message
      });
    }
  }
}

export { UpdateOrderStatusController };
