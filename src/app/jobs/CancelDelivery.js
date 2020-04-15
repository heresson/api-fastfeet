import Mail from '../../lib/Mail';

class CancelDelivery {
  get key() {
    return 'CancelDelivery';
  }

  async handle({ data }) {
    const { delivery, deliveryman, problem } = data;

    await Mail.sendMail({
      to: `${deliveryman.name}<${deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancelDelivery',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        deliveryId: delivery.id,
        problem: problem.description,
      },
    });
  }
}
export default new CancelDelivery();
