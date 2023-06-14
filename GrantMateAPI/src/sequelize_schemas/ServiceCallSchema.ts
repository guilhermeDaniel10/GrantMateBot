import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "service_call",
})
export class ServiceCallSchema extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  endpoint!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  payload!: object;
}
