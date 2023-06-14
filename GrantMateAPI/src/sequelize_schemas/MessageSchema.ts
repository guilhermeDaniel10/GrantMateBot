import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { PredefinedMessageSchema } from "./PredefinedMessageSchema";

@Table({
  timestamps: true,
  tableName: "message",
})
export class MessageSchema extends Model {
  @Column({
    type: DataType.STRING(900),
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  fromBot!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timestamp!: Date;

  @ForeignKey(() => PredefinedMessageSchema)
  @Column({ type: DataType.INTEGER, allowNull: true, onDelete: "CASCADE" })
  predefinedMessageId!: number;

  @BelongsTo(() => PredefinedMessageSchema)
  predefinedMessage?: PredefinedMessageSchema;
}
