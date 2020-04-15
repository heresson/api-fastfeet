import * as Yup from 'yup';
import {
  parseISO,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
  getDate,
  getMonth,
  getYear,
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

    const { start_date } = req.body;

    // permit only 5 deliveries ina a day
    const numOfDeliveries = await Delivery.count({
      where: {
        start_date,
        deliveryman_id: deliverymanId,
      },
    });
    if (numOfDeliveries > 5) {
      return res
        .status(400)
        .json({ error: 'You can only withdraw 5 products ina day' });
    }

    // check start_date between 8h00 - 18h00
    const start_date_ISO = parseISO(start_date);
    const dateBeforePermitted = setSeconds(
      setMinutes(
        setHours(
          new Date(
            getYear(start_date_ISO),
            getMonth(start_date_ISO),
            getDate(start_date_ISO)
          ),
          7
        ),
        59
      ),
      59
    );
    const dateAfterPermitted = setSeconds(
      setMinutes(
        setHours(
          new Date(
            getYear(start_date_ISO),
            getMonth(start_date_ISO),
            getDate(start_date_ISO)
          ),
          18
        ),
        0
      ),
      0
    );

    if (
      isBefore(start_date_ISO, dateBeforePermitted) ||
      isAfter(start_date_ISO, dateAfterPermitted)
    ) {
      return res
        .status(400)
        .json({ error: 'start_date must be between 8h and 18h' });
    }

    const deliveryUpdated = await deliveryExists.update(req.body);

    return res.json({ deliveryUpdated });
  }
}
export default new WithdrawDeliveryController();
