import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

// Dynamically import Request model before using it
let Request: typeof import("./Requests").default;

const initializeRequestModel = async () => {
  Request = (await import("./Requests")).default;
};

// Call initializeRequestModel before using the File model
initializeRequestModel().catch((error) => {
  console.error("Error loading Request model", error);
});

@Table({ tableName: "FILES", timestamps: false })
export default class File extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare file_id: number;

  // Use the Request model after it's dynamically imported
  @ForeignKey(() => Request)
  @Column(DataType.INTEGER)
  declare request_id: number;

  @BelongsTo(() => Request)
  declare request: Request;

  @Column(DataType.TEXT)
  declare file_url: string;

  @Column(DataType.DATE)
  declare uploaded_at: Date;
}
