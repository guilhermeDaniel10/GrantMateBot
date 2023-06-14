import { Sequelize } from "sequelize-typescript";

import dotenv from "dotenv";
import { UserSchema } from "../sequelize_schemas/UserSchema";
import { SystemRoleSchema } from "../sequelize_schemas/SystemRoleSchema";
import { FileSchema } from "../sequelize_schemas/FileSchema";
import { PredefinedMessageSchema } from "../sequelize_schemas/PredefinedMessageSchema";
import { MessageSchema } from "../sequelize_schemas/MessageSchema";
import { DropdownSchema } from "../sequelize_schemas/DropdownSchema";
import { DropdownValueSchema } from "../sequelize_schemas/DropdownValueSchema";
import { ServiceCallSchema } from "../sequelize_schemas/ServiceCallSchema";
import { PredefinedMessageRelationSchema } from "../sequelize_schemas/PredefinedMessagesRelationSchema";

const dotenvPath = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV}`
  : ".env";
dotenv.config({ path: dotenvPath });

console.log(process.env);

const connection = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_ROOT_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.NODE_ENV != "development" ? parseInt(process.env.DB_PORT!) : undefined,
  logging: false,
  models: [
    SystemRoleSchema,
    UserSchema,
    FileSchema,
    PredefinedMessageSchema,
    MessageSchema,
    DropdownSchema,
    DropdownValueSchema,
    ServiceCallSchema,
    PredefinedMessageRelationSchema,
  ],
});

const connectToDatabase = async () => {
  await connection.sync();
};

module.exports = {
  connectToDatabase,
  connection: connection,
};
