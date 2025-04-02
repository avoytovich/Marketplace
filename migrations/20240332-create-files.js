module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FILES", {
      file_id: {
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
      file_url: { type: Sequelize.TEXT, allowNull: false },
      uploaded_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("FILES");
  },
};
