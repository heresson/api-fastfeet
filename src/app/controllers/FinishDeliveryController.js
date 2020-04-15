import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';

class FinishDeliveryController {
  async update(req, res) {
    const { deliverymanId, deliveryId } = req.params;
    const { signature_id } = req.body;

    const schema = Yup.object().shape({
      signature_id: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    // check if deliverymanId is valid
    const deliverymanExists = await Deliveryman.findByPk(deliverymanId);
    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Invalid deliverymanId' });
    }

    // check if deliveryId is valid
    const deliveryExists = await Delivery.findByPk(deliveryId);
    if (!deliveryExists) {
      return res.status(400).json({ error: 'Invalid deliveryId' });
    }

    // check if signature_id is valid
    const signatureExists = await File.findOne({
      where: { id: signature_id },
    });
    if (!signatureExists) {
      return res.status(400).json({ error: 'Invalid signature_id' });
    }
    const delivery = await Delivery.findByPk(deliveryId, {
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    delivery.end_date = new Date();
    delivery.signature_id = signature_id;

    await delivery.save();

    return res.json(delivery);
  }
}
export default new FinishDeliveryController();
