import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { DropdownValueSchema } from "./DropdownValueSchema";

@Table({
  timestamps: true,
  tableName: "dropdown",
})
export class DropdownSchema extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameId!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  asButton!: boolean;

  @HasMany(() => DropdownValueSchema)
  dropdownValues?: DropdownValueSchema[];
}
