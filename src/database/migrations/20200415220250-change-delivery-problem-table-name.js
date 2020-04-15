module.exports = {
  up: (queryInterface) => {
    return queryInterface.renameTable('delivery_problem', 'delivery_problems');
  },

  down: (queryInterface) => {
    return queryInterface.renameTable('delivery_problems', 'delivery_problem');
  },
};
