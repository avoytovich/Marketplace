module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("REVIEWS", {
      review_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      from_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "USERS", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      to_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "USERS", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("REVIEWS");
  },
};
