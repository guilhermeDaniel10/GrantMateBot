import expressLoader from "./express";
import dependencyInjectorLoader from "./dependencyInjector";
import config from "../config";
const { connectToDatabase } = require("../configurations/database");

export default ({ expressApp }: any) => {
  //await connectToDatabaseSync();´
  connectToDatabase().then(() => {
    console.log("Connected to the database!");
  });
  loadSequelizeSchemas();
  expressLoader({ app: expressApp });
};

async function loadSequelizeSchemas(): Promise<void> {
  const userSchema = {
    // compare with the approach followed in repos and services
    name: "userSequelizeSchema",
    sequelizeSchema: "../sequelize-schemas/User",
  };

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path,
  };

  const systemRoleRepo = {
    name: config.repos.systemRole.name,
    path: config.repos.systemRole.path,
  };

  const fileRepo = {
    name: config.repos.file.name,
    path: config.repos.file.path,
  };

  const predefinedMessageRepo = {
    name: config.repos.predefinedMessage.name,
    path: config.repos.predefinedMessage.path,
  };

  const dropdownRepo = {
    name: config.repos.dropdown.name,
    path: config.repos.dropdown.path,
  };

  const dropdownValueRepo = {
    name: config.repos.dropdownValue.name,
    path: config.repos.dropdownValue.path,
  };

  const serviceCallRepo = {
    name: config.repos.serviceCall.name,
    path: config.repos.serviceCall.path,
  };

  const predefinedMessageRelationRepo = {
    name: config.repos.predefinedMessageRelation.name,
    path: config.repos.predefinedMessageRelation.path,
  };

  const userService = {
    name: config.services.user.name,
    path: config.services.user.path,
  };

  const systemRoleService = {
    name: config.services.systemRole.name,
    path: config.services.systemRole.path,
  };

  const gptAiWritterService = {
    name: config.services.gptWritter.name,
    path: config.services.gptWritter.path,
  };

  const fileManagerService = {
    name: config.services.fileManager.name,
    path: config.services.fileManager.path,
  };

  const modelManagerService = {
    name: config.services.modelManager.name,
    path: config.services.modelManager.path,
  };

  const topicService = {
    name: config.services.topic.name,
    path: config.services.topic.path,
  };

  const embedService = {
    name: config.services.embed.name,
    path: config.services.embed.path,
  };

  const hierarchyService = {
    name: config.services.hierarchy.name,
    path: config.services.hierarchy.path,
  };

  const predefinedMessageReadService = {
    name: config.services.predefinedMessageReader.name,
    path: config.services.predefinedMessageReader.path,
  };

  const dropdownReadService = {
    name: config.services.dropdownReader.name,
    path: config.services.dropdownReader.path,
  };

  const serviceCallService = {
    name: config.services.serviceCallReader.name,
    path: config.services.serviceCallReader.path,
  };

  const predefinedMessageRelationReadService = {
    name: config.services.predefinedMessageRelationReader.name,
    path: config.services.predefinedMessageRelationReader.path,
  };

  const predefinedMessagesBootstrapService = {
    name: config.services.predefinedMessagesBootstrap.name,
    path: config.services.predefinedMessagesBootstrap.path,
  };

  const messageFlowService = {
    name: config.services.messageFlow.name,
    path: config.services.messageFlow.path,
  };

  const userController = {
    name: config.controllers.user.name,
    path: config.controllers.user.path,
  };

  const systemRoleController = {
    name: config.controllers.systemRole.name,
    path: config.controllers.systemRole.path,
  };

  const gptAiWritterController = {
    name: config.controllers.gptWritter.name,
    path: config.controllers.gptWritter.path,
  };

  const fileManagerController = {
    name: config.controllers.fileManager.name,
    path: config.controllers.fileManager.path,
  };

  const modelManagerController = {
    name: config.controllers.modelManager.name,
    path: config.controllers.modelManager.path,
  };

  const topicController = {
    name: config.controllers.topic.name,
    path: config.controllers.topic.path,
  };

  const embedController = {
    name: config.controllers.embed.name,
    path: config.controllers.embed.path,
  };

  const predefinedMessageController = {
    name: config.controllers.predefinedMessage.name,
    path: config.controllers.predefinedMessage.path,
  };

  const dropdownController = {
    name: config.controllers.dropdownController.name,
    path: config.controllers.dropdownController.path,
  };

  const chatController = {
    name: config.controllers.chat.name,
    path: config.controllers.chat.path,
  };

  const kafkaCommunicator = {
    name: config.communicators.kafka.name,
    path: config.communicators.kafka.path,
  };

  const restCommunicator = {
    name: config.communicators.rest.name,
    path: config.communicators.rest.path,
  };

  const predefinedMessageFactory = {
    name: config.factories.predefinedMessage.name,
    path: config.factories.predefinedMessage.path,
  };

  const dropdownFactory = {
    name: config.factories.dropdown.name,
    path: config.factories.dropdown.path,
  };

  const dropdownValueFactory = {
    name: config.factories.dropdownValue.name,
    path: config.factories.dropdownValue.path,
  };

  await dependencyInjectorLoader({
    //sequelizeSchemas: [userSchema],
    controllers: [
      systemRoleController,
      userController,
      gptAiWritterController,
      fileManagerController,
      modelManagerController,
      topicController,
      embedController,
      predefinedMessageController,
      dropdownController,
      chatController,
    ],
    repos: [
      systemRoleRepo,
      userRepo,
      fileRepo,
      predefinedMessageRepo,
      dropdownRepo,
      dropdownValueRepo,
      serviceCallRepo,
      predefinedMessageRelationRepo,
    ],
    services: [
      systemRoleService,
      userService,
      gptAiWritterService,
      fileManagerService,
      modelManagerService,
      topicService,
      embedService,
      hierarchyService,
      predefinedMessageReadService,
      dropdownReadService,
      serviceCallService,
      predefinedMessageRelationReadService,
      predefinedMessagesBootstrapService,
      messageFlowService,
    ],
    communicators: [restCommunicator],
    factories: [
      predefinedMessageFactory,
      dropdownFactory,
      dropdownValueFactory,
    ],
  });
}
