import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll();
    return res.json(deliverymen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      avatar_id: Yup.number().positive(),
    });

    // check req body validation
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    // check if email is already saved to a deliveryman
    const emailExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already saved' });
    }

    // check if avatar_id is valid
    const avatarExists = await File.findOne({
      where: { id: req.body.avatar_id },
    });
    if (!avatarExists) {
      return res.status(400).json({ error: 'Invalid avatar_id' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async show(req, res) {
    const { id } = req.params;
    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: "Deliveryman does't exist." });
    }
    return res.json(deliveryman);
  }

  async update(req, res) {
    const { id } = req.params;
    const { email, avatar_id } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number().positive(),
    });

    // check req body validation
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    // check if new email exists in database
    if (email) {
      const emailExists = await Deliveryman.findOne({
        where: { email: req.body.email },
      });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already saved' });
      }
    }

    // check if avatar_id is valid
    if (avatar_id) {
      const avatarExists = await File.findOne({
        where: { id: req.body.avatar_id },
      });
      if (!avatarExists) {
        return res.status(400).json({ error: 'Invalid avatar_id' });
      }
    }

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: "Deliveryman does't exist." });
    }

    const deliverymanUpdated = await deliveryman.update(req.body);

    return res.json(deliverymanUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: "Deliveryman does't exist." });
    }

    await Deliveryman.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'ok' });
  }
}
export default new DeliverymanController();
