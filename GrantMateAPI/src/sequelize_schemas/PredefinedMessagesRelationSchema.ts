import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeValidate,
} from "sequelize-typescript";
import { PredefinedMessageSchema } from "./PredefinedMessageSchema";
import { DropdownValueSchema } from "./DropdownValueSchema";

@Table({
  timestamps: true,
  tableName: "predefined_message_relation",
})
export class PredefinedMessageRelationSchema extends Model {
  @ForeignKey(() => PredefinedMessageSchema)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  predefinedMessageAId!: number;

  @ForeignKey(() => DropdownValueSchema)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    onDelete: 'CASCADE',
  })
  predefinedDropdownValueAId!: number;

  @ForeignKey(() => PredefinedMessageSchema)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  predefinedMessageBId!: number;

  @ForeignKey(() => PredefinedMessageSchema)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    onDelete: 'CASCADE',
  })
  predefinedMessageBIdOnCancel!: number;

  @BelongsTo(() => PredefinedMessageSchema, "predefinedMessageAId")
  predefinedMessageA!: PredefinedMessageSchema;

  @BelongsTo(() => PredefinedMessageSchema, "predefinedMessageBId")
  predefinedMessageB!: PredefinedMessageSchema;

  @BelongsTo(() => PredefinedMessageSchema, "predefinedMessageBIdOnCancel")
  predefinedMessageBOnCancel!: PredefinedMessageSchema;

  @BelongsTo(() => DropdownValueSchema)
  dropdownValue!: DropdownValueSchema;

  @BeforeValidate
  static validateColumns(instance: PredefinedMessageRelationSchema) {
    if (
      instance.predefinedMessageAId === null &&
      instance.predefinedDropdownValueAId !== null
    ) {
      throw new Error(
        "If predefinedMessageAId is null, predefinedDropdownValueAId cannot be null."
      );
    }
  }
}
