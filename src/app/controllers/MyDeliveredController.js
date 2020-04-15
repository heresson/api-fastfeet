import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

class MyDeliveriesController {
  async index(req, res) {
    const deliveryman_id = req.params.id;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        signature_id: { [Op.not]: null },
      },
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'recipient_id',
        'signature_id',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'fullAddress'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    res.json(deliveries);
  }
}
export default new MyDeliveriesController();
