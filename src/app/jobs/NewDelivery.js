import Mail from '../../lib/Mail';

class NewDelivery {
  get key() {
    return 'NewDelivery';
  }

  async handle({ data }) {
    const { delivery, deliveryman, recipient, fullAddress } = data;

    await Mail.sendMail({
      to: `${deliveryman.name}<${deliveryman.email}>`,
      subject: 'Nova entrega para voce',
      template: 'newDelivery',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        recipient: recipient.name,
        fullAddress,
      },
    });
  }
}
export default new NewDelivery();
