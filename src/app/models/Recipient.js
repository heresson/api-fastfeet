import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.STRING,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zipcode: Sequelize.STRING,
        fullAddress: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${this.street}, ${this.number} (complemento: ${this.complement}). ${this.city}/${this.state} - ${this.zipcode}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  organizeAddress(recipients) {
    // recipients;

    return recipients;
  }
}
export default Recipient;
