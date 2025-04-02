module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TRANSACTIONS", {
      transaction_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      proposal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "PROPOSALS", key: "proposal_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "USERS", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "USERS", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount: { type: Sequelize.DECIMAL },
      payment_status: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("TRANSACTIONS");
  },
};
