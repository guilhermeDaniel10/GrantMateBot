import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "file",
})
export class FileSchema extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  filename!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  size!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  extension!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  accessLevel!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  gptTrained!: boolean;
}
