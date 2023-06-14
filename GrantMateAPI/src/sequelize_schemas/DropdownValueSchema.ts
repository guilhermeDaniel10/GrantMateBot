import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { DropdownSchema } from "./DropdownSchema";
import { PredefinedMessageRelationSchema } from "./PredefinedMessagesRelationSchema";

@Table({
  timestamps: true,
  tableName: "dropdown_value",
})
export class DropdownValueSchema extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameId!: string;

  @ForeignKey(() => DropdownSchema)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  dropdownId!: number;

  @BelongsTo(() => DropdownSchema)
  dropdown!: DropdownSchema;

  @HasMany(() => PredefinedMessageRelationSchema)
  messageRelations?: PredefinedMessageRelationSchema[];
}
