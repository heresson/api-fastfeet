import * as Yup from 'yup';
import {
  parseISO,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

class WithdrawDeliveryController {
  async update(req, res) {
    const { deliverymanId, deliveryId } = req.params;

    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
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

    // check start_date between 8h00 - 18h00
    const { start_date } = req.body;
    const start_date_ISO = parseISO(start_date);

    if (
      isBefore(
        start_date_ISO,
        setSeconds(setMinutes(setHours(new Date(), 7), 59), 59)
      ) ||
      isAfter(
        start_date_ISO,
        setSeconds(setMinutes(setHours(new Date(), 18), 0), 0)
      )
    ) {
      return res
        .status(400)
        .json({ error: 'start_date must be between 8h and 18h' });
    }

    return res.json({ start_date });
  }
}
export default new WithdrawDeliveryController();
