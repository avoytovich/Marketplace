module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PROPOSALS", {
      proposal_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "REQUESTS", key: "request_id" },
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
      price: { type: Sequelize.DECIMAL(10, 2) },
      estimated_time: { type: Sequelize.STRING },
      message: { type: Sequelize.TEXT },
      portfolio_url: { type: Sequelize.TEXT },
      status: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("PROPOSALS");
  },
};
