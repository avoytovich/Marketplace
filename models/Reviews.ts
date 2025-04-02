import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

// Dynamically import the User model before using it
let User: typeof import("./Users").default;

const initializeUserModel = async () => {
  User = (await import("./Users")).default;
};

// Call initializeUserModel before using the Review model
initializeUserModel().catch((error) => {
  console.error("Error loading User model", error);
});

@Table({ tableName: "REVIEWS", timestamps: false })
export default class Review extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare review_id: number;

  // Use the dynamically imported User model with typeof to get its type
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare from_user_id: number;

  @BelongsTo(() => User, { foreignKey: "from_user_id", as: "fromUser" })
  declare fromUser: typeof User;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare to_user_id: number;

  @BelongsTo(() => User, { foreignKey: "to_user_id", as: "toUser" })
  declare toUser: typeof User;

  @Column({ type: DataType.INTEGER, validate: { min: 1, max: 5 } }) // Ensures rating is between 1-5
  declare rating: number;

  @Column(DataType.TEXT)
  declare comment: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW }) // Auto-generates timestamp
  declare created_at: Date;
}
