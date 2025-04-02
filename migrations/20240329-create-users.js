module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("USERS", {
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: false },
      is_activate: { type: Sequelize.BOOLEAN, defaultValue: true },
      profile_picture: { type: Sequelize.TEXT },
      bio: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("USERS");
  },
};
