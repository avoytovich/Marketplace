import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import pg from "pg"; // Explicitly import the pg library

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  dialect: "postgres", // Use PostgreSQL as dialect
  dialectModule: pg, // Explicitly specify the PostgreSQL module (pg)
});

// Dynamically import models
const initializeModels = async () => {
  const { default: User } = await import("./models/Users");
  const { default: Request } = await import("./models/Requests");
  const { default: Proposal } = await import("./models/Proposals");
  const { default: Transaction } = await import("./models/Transactions");
  const { default: Message } = await import("./models/Messages");
  const { default: Review } = await import("./models/Reviews");
  const { default: File } = await import("./models/Files");

  sequelize.addModels([
    User,
    Request,
    Proposal,
    Transaction,
    Message,
    Review,
    File,
  ]);
};

// Call initializeModels before using sequelize
initializeModels()
  .then(() => console.log("Models initialized successfully"))
  .catch((error) => console.error("Error initializing models:", error));

export default sequelize;
