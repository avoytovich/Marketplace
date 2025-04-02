module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("REQUESTS", {
      request_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "USERS", key: "user_id" },
      },
      title: { type: Sequelize.STRING, allowNull: false },
      category: { type: Sequelize.STRING, allowNull: false },
      budget_min: { type: Sequelize.DECIMAL },
      budget_max: { type: Sequelize.DECIMAL },
      description: { type: Sequelize.TEXT },
      location: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("REQUESTS");
  },
};
