import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll();
    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    // verifica se deliveryman_id e valido
    const deliverymanExists = await Deliveryman.findOne({
      where: { id: req.body.deliveryman_id },
    });
    if (!deliverymanExists) {
      return res.status(400).json({ error: `Deliveryman does't exist` });
    }

    // verifica se recipient_id e valido
    const recipientExists = await Recipient.findOne({
      where: { id: req.body.recipient_id },
    });
    if (!recipientExists) {
      return res.status(400).json({ error: `Recipient does't exist` });
    }

    const delivery = await Delivery.create(req.body);
    return res.json(delivery);
  }

  async show(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: `Delivery does't exist.` });
    }
    return res.json(delivery);
  }

  async delete(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id);

    if (!delivery || delivery.canceled_at !== null) {
      return res.status(400).json({ error: "Deliver does't exist." });
    }

    delivery.canceled_at = new Date();
    await delivery.save();
    return res.json(delivery);
  }

  async update(req, res) {
    const { id } = req.params;
    const { deliveryman_id, recipient_id } = req.body;

    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number().positive(),
      deliveryman_id: Yup.number().positive(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    // check if recipient_id is valid
    if (recipient_id) {
      const recipientExists = await Recipient.findOne({
        where: { id: req.body.recipient_id },
      });
      if (!recipientExists) {
        return res.status(400).json({ error: 'Invalid recipient_id' });
      }
    }

    // check if deliveryman_id is valid
    if (deliveryman_id) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { id: req.body.deliveryman_id },
      });
      if (!deliverymanExists) {
        return res.status(400).json({ error: 'Invalid deliveryman_id' });
      }
    }

    // if delivery.id doesn't exist
    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      return res.status(400).json({ error: "Delivery does't exist." });
    }

    const deliveryUpdated = await delivery.update(req.body);
    return res.json(deliveryUpdated);
  }
}
export default new DeliveryController();
