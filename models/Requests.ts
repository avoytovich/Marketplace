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
let User: typeof import("./Users").default;
let File: typeof import("./Files").default;
let Proposal: typeof import("./Proposals").default;

const initializeModels = async () => {
  User = (await import("./Users")).default;
  File = (await import("./Files")).default;
  Proposal = (await import("./Proposals")).default;
};

// Call initializeModels before using the Request model
initializeModels().catch((error) => {
  console.error("Error loading models", error);
});

@Table({ tableName: "REQUESTS", timestamps: false })
export default class Request extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare request_id: number;

  // Use the dynamically imported User model with typeof to get its type
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: typeof User;

  @Column(DataType.STRING)
  declare title: string;

  @Column(DataType.STRING)
  declare category: string;

  @Column(DataType.INTEGER) // Changed from DataType.NUMBER (invalid)
  declare budget_min: number;

  @Column(DataType.INTEGER) // Changed from DataType.NUMBER (invalid)
  declare budget_max: number;

  @Column(DataType.TEXT)
  declare description: string;

  @Column(DataType.STRING)
  declare location: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW }) // Fixed timestamp type
  declare created_at: Date;

  // Associations with dynamically imported models
  @HasMany(() => File)
  declare files: (typeof File)[];

  @HasMany(() => Proposal)
  declare proposals: (typeof Proposal)[];
}
