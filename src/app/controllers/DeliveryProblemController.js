import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const { deliveryId } = req.params;

    // check if deliveryId is valid
    const deliveryExists = await Delivery.findByPk(deliveryId);
    if (!deliveryExists) {
      return res.status(400).json({ error: 'Invalid deliveryId' });
    }

    const problems = await DeliveryProblem.findAll();

    return res.json(problems);
  }

  async store(req, res) {
    const { deliveryId } = req.params;
    const { description } = req.body;

    const schema = Yup.object().shape({
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    // check if deliveryId is valid
    const deliveryExists = await Delivery.findByPk(deliveryId);
    if (!deliveryExists) {
      return res.status(400).json({ error: 'Invalid deliveryId' });
    }

    const deliveryController = await DeliveryProblem.create({
      description,
      delivery_id: deliveryId,
    });
    return res.json(deliveryController);
  }
}
export default new DeliveryProblemController();
