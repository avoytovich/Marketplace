import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";

// Dynamically import models before using them
let Request: typeof import("./Requests").default;
let User: typeof import("./Users").default;
let Transaction: typeof import("./Transactions").default;
let Message: typeof import("./Messages").default;

const initializeModels = async () => {
  Request = (await import("./Requests")).default;
  User = (await import("./Users")).default;
  Transaction = (await import("./Transactions")).default;
  Message = (await import("./Messages")).default;
};

// Call initializeModels before using the Proposal model
initializeModels().catch((error) => {
  console.error("Error loading models", error);
});

@Table({ tableName: "PROPOSALS", timestamps: false })
export default class Proposal extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare proposal_id: number;

  // Use the dynamically imported Request model with typeof to get its type
  @ForeignKey(() => Request)
  @Column(DataType.INTEGER)
  declare request_id: number;

  @BelongsTo(() => Request, { foreignKey: "request_id", as: "request" })
  declare request: typeof Request;

  // Use the dynamically imported User model with typeof to get its type
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare seller_id: number;

  @BelongsTo(() => User, { foreignKey: "seller_id", as: "seller" })
  declare seller: typeof User;

  @Column({ type: DataType.DECIMAL(10, 2) }) // Fix: Use DECIMAL for prices
  declare price: number;

  @Column(DataType.STRING)
  declare estimated_time: string;

  @Column(DataType.TEXT)
  declare message: string;

  @Column(DataType.TEXT)
  declare portfolio_url: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW }) // Ensures auto-generation
  declare created_at: Date;

  // Associations with dynamically imported models
  @HasMany(() => Transaction)
  declare transactions: (typeof Transaction)[];

  @HasMany(() => Message)
  declare messages: (typeof Message)[];
}
