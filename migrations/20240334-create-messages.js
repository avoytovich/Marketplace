module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MESSAGES", {
      message_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "USERS", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "USERS", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      proposal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "PROPOSALS", key: "proposal_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      message: { type: Sequelize.TEXT, allowNull: false },
      read_status: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("MESSAGES");
  },
};
