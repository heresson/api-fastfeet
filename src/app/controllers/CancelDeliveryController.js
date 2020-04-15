import Queue from '../../lib/Queue';
import CancelDelivery from '../jobs/CancelDelivery';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class CancelDeliveryController {
  async delete(req, res) {
    const problemId = req.params.id;

    // verifica se problemId e valido
    const problemExists = await DeliveryProblem.findOne({
      where: { id: problemId },
    });
    if (!problemExists) {
      return res.status(400).json({ error: `Problem does't exist` });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: problemExists.delivery_id,
      },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    delivery.canceled_at = new Date();
    delivery.save();

    await Queue.add(CancelDelivery.key, {
      delivery,
      deliveryman: delivery.deliveryman,
      problem: problemExists,
    });

    return res.json(delivery);
  }
}
export default new CancelDeliveryController();
