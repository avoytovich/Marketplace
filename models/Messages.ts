import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

// Dynamically import User and Proposal models before using them
let User: typeof import("./Users").default;
let Proposal: typeof import("./Proposals").default;

const initializeModels = async () => {
  User = (await import("./Users")).default;
  Proposal = (await import("./Proposals")).default;
};

// Call initializeModels before using the Message model
initializeModels().catch((error) => {
  console.error("Error loading User or Proposal model", error);
});

@Table({ tableName: "MESSAGES", timestamps: false })
export default class Message extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare message_id: number;

  // Use the dynamically imported User model with typeof to get its type
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare sender_id: number;

  @BelongsTo(() => User, { foreignKey: "sender_id", as: "sender" })
  declare sender: typeof User;

  // Use the dynamically imported User model with typeof to get its type
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare receiver_id: number;

  @BelongsTo(() => User, { foreignKey: "receiver_id", as: "receiver" })
  declare receiver: typeof User;

  // Use the dynamically imported Proposal model with typeof to get its type
  @ForeignKey(() => Proposal)
  @Column(DataType.INTEGER)
  declare proposal_id: number;

  @BelongsTo(() => Proposal)
  declare proposal: typeof Proposal;

  @Column(DataType.TEXT)
  declare message: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare read_status: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare created_at: Date;
}
