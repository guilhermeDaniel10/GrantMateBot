import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "system_role",
})
export class SystemRoleSchema extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  systemRoleName!: string;

}
