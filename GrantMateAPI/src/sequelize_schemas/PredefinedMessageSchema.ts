import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { MessageSchema } from "./MessageSchema";
import { PredefinedMessageRelationSchema } from "./PredefinedMessagesRelationSchema";
import { ServiceCallSchema } from "./ServiceCallSchema";
import { DropdownSchema } from "./DropdownSchema";

@Table({
  timestamps: true,
  tableName: "predefined_message",
})
export class PredefinedMessageSchema extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameId!: string;

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
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  selectable!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  customizable!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  canCancel!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  openField?: boolean;

  @ForeignKey(() => DropdownSchema)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    onDelete: 'CASCADE',
  })
  dropdownId?: number;

  @ForeignKey(() => ServiceCallSchema)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  serviceCallId?: number;

  @BelongsTo(() => DropdownSchema, "dropdownId")
  dropdown!: DropdownSchema;

  @BelongsTo(() => ServiceCallSchema, "serviceCallId")
  serviceCall!: ServiceCallSchema;

  @HasMany(() => MessageSchema)
  messages?: MessageSchema[];

  @HasMany(() => PredefinedMessageRelationSchema)
  messageRelations?: PredefinedMessageRelationSchema[];
}
