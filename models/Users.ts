import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";

// Dynamically import related models before using them
let Request: typeof import("./Requests").default;
let Proposal: typeof import("./Proposals").default;
let Transaction: typeof import("./Transactions").default;
let Message: typeof import("./Messages").default;
let Review: typeof import("./Reviews").default;

const initializeModels = async () => {
  Request = (await import("./Requests")).default;
  Proposal = (await import("./Proposals")).default;
  Transaction = (await import("./Transactions")).default;
  Message = (await import("./Messages")).default;
  Review = (await import("./Reviews")).default;
};

// Call initializeModels before using the User model
initializeModels().catch((error) => {
  console.error("Error loading related models", error);
});

@Table({ tableName: "USERS", timestamps: false })
export default class User extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare user_id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare username: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password_hash: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: "user" })
  declare role: string; // Example values: "user", "admin"

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_activate: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare profile_picture: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare bio: string | null;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare created_at: Date;

  // Associations
  @HasMany(() => Request, { foreignKey: "user_id", as: "requests" })
  declare requests: (typeof Request)[];

  @HasMany(() => Proposal, { foreignKey: "seller_id", as: "proposals" })
  declare proposals: (typeof Proposal)[];

  @HasMany(() => Transaction, {
    foreignKey: "buyer_id",
    as: "transactionsAsBuyer",
  })
  declare transactionsAsBuyer: (typeof Transaction)[];

  @HasMany(() => Transaction, {
    foreignKey: "seller_id",
    as: "transactionsAsSeller",
  })
  declare transactionsAsSeller: (typeof Transaction)[];

  @HasMany(() => Message, { foreignKey: "sender_id", as: "sentMessages" })
  declare sentMessages: (typeof Message)[];

  @HasMany(() => Message, { foreignKey: "receiver_id", as: "receivedMessages" })
  declare receivedMessages: (typeof Message)[];

  @HasMany(() => Review, { foreignKey: "from_user_id", as: "reviewsGiven" })
  declare reviewsGiven: (typeof Review)[];

  @HasMany(() => Review, { foreignKey: "to_user_id", as: "reviewsReceived" })
  declare reviewsReceived: (typeof Review)[];
}
