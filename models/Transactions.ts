import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

// Dynamically import Proposal and User models before using them
let Proposal: typeof import("./Proposals").default;
let User: typeof import("./Users").default;

const initializeModels = async () => {
  Proposal = (await import("./Proposals")).default;
  User = (await import("./Users")).default;
};

// Call initializeModels before using the Transaction model
initializeModels().catch((error) => {
  console.error("Error loading Proposal or User model", error);
});

@Table({ tableName: "TRANSACTIONS", timestamps: false })
export default class Transaction extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare transaction_id: number;

  // Use the dynamically imported Proposal model with typeof to get its type
  @ForeignKey(() => Proposal)
  @Column(DataType.INTEGER)
  declare proposal_id: number;

  @BelongsTo(() => Proposal, { foreignKey: "proposal_id", as: "proposal" })
  declare proposal: typeof Proposal;

  // Use the dynamically imported User model with typeof to get its type
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare buyer_id: number;

  @BelongsTo(() => User, { foreignKey: "buyer_id", as: "buyer" })
  declare buyer: typeof User;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare seller_id: number;

  @BelongsTo(() => User, { foreignKey: "seller_id", as: "seller" })
  declare seller: typeof User;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false }) // Ensures financial accuracy
  declare amount: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare payment_status: string; // Example values: "pending", "completed", "failed"

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare created_at: Date;
}
