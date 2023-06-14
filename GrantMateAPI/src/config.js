import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const dotenvPath =
  process.env.NODE_ENV == "development"
    ? ".env"
    : `.env.${process.env.NODE_ENV}`;

const envFound = dotenv.config({ path: dotenvPath });
if (!envFound) {
  // This error should crash whole process
  throw new Error("Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Port
   */
  port: parseInt(process.env.PORT, 10) || 3000,
  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "info",
  },

  /**
   * API configs
   */
  api: {
    prefix: "/api/v1",
  },

  jwtSecret:
    process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  repos: {
    user: {
      name: "UserRepo",
      path: "../repositories/implementation_repositories/UserRepo",
    },
    systemRole: {
      name: "SystemRoleRepo",
      path: "../repositories/implementation_repositories/SystemRoleRepo",
    },
    file: {
      name: "FileRepo",
      path: "../repositories/implementation_repositories/FileRepo",
    },
    predefinedMessage: {
      name: "PredefinedMessageRepo",
      path: "../repositories/implementation_repositories/PredefinedMessageRepo",
    },
    dropdown: {
      name: "DropdownRepo",
      path: "../repositories/implementation_repositories/DropdownRepo",
    },
    dropdownValue: {
      name: "DropdownValueRepo",
      path: "../repositories/implementation_repositories/DropdownValueRepo",
    },
    serviceCall: {
      name: "ServiceCallRepo",
      path: "../repositories/implementation_repositories/ServiceCallRepo",
    },
    predefinedMessageRelation: {
      name: "PredefinedMessageRelationRepo",
      path: "../repositories/implementation_repositories/PredefinedMessageRelationRepo",
    },
  },

  services: {
    user: {
      name: "UserService",
      path: "../services/implementation_services/UserService",
    },
    systemRole: {
      name: "SystemRoleService",
      path: "../services/implementation_services/SystemRoleService",
    },
    gptWritter: {
      name: "GPTWritterService",
      path: "../services/implementation_services/GPTWritterService",
    },
    fileManager: {
      name: "FileManagerService",
      path: "../services/implementation_services/FileManagerService",
    },
    modelManager: {
      name: "ModelManagerService",
      path: "../services/implementation_services/ModelManagerService",
    },
    topic: {
      name: "TopicService",
      path: "../services/implementation_services/TopicService",
    },
    embed: {
      name: "EmbedService",
      path: "../services/implementation_services/EmbedService",
    },
    hierarchy: {
      name: "HierarchyManagerService",
      path: "../services/implementation_services/HierarchyManagerService",
    },
    predefinedMessageReader: {
      name: "PredefinedMessageReadService",
      path: "../services/implementation_services/message_services/PredefinedMessageReadService",
    },
    dropdownReader: {
      name: "DropdownReadService",
      path: "../services/implementation_services/message_services/DropdownReadService",
    },
    serviceCallReader: {
      name: "ServiceCallService",
      path: "../services/implementation_services/message_services/ServiceCallService",
    },
    predefinedMessageRelationReader: {
      name: "PredefinedMessageRelationReadService",
      path: "../services/implementation_services/message_services/PredefinedMessageRelationReadService",
    },
    predefinedMessagesBootstrap: {
      name: "PredefinedMessagesBootstrapService",
      path: "../services/implementation_services/message_services/PredefinedMessagesBootstrapService",
    },
    messageFlow: {
      name: "MessageFlowService",
      path: "../services/implementation_services/message_services/MessageFlowService",
    },
  },

  controllers: {
    user: {
      name: "UserController",
      path: "../controllers/user/implementation-controllers/UserController",
    },
    systemRole: {
      name: "SystemRoleController",
      path: "../controllers/system-role/implementation-controllers/SystemRoleController",
    },
    gptWritter: {
      name: "GPTAIWritterController",
      path: "../controllers/gpt-ai-writter/implementation-controllers/GPTAIWritterController",
    },
    fileManager: {
      name: "FileManagerController",
      path: "../controllers/file-manager/implementation-controllers/FileManagerController",
    },
    modelManager: {
      name: "ModelManagerController",
      path: "../controllers/model-manager/implementation-controllers/ModelManagerController",
    },
    topic: {
      name: "TopicController",
      path: "../controllers/topic-controller/implementation-controllers/TopicController",
    },
    embed: {
      name: "EmbedController",
      path: "../controllers/embed/implementation-controllers/EmbedController",
    },
    predefinedMessage: {
      name: "PredefinedMessageController",
      path: "../controllers/message/implementation-controllers/PredefinedMessageController",
    },
    dropdownController: {
      name: "DropdownController",
      path: "../controllers/message/implementation-controllers/DropdownController",
    },
    chat: {
      name: "ChatController",
      path: "../controllers/message/implementation-controllers/ChatController",
    },
  },

  kafka: {
    clientId: process.env.KAFKA_NODE_ID,
    brokers: [process.env.KAFKA_BROKER_ADDRESS],
  },

  communicators: {
    kafka: {
      name: "KafkaCommunicator",
      path: "../communicators/implementation-communicators/KafkaCommunicator",
    },
    rest: {
      name: "RestCommunicator",
      path: "../communicators/implementation-communicators/RestCommunicator",
    },
  },

  factories: {
    predefinedMessage: {
      name: "PredefinedMessageFactory",
      path: "../factories/implementation-factories/PredefinedMessageFactory",
    },
    dropdown: {
      name: "DropdownFactory",
      path: "../factories/implementation-factories/DropdownFactory",
    },
    dropdownValue: {
      name: "DropdownValueFactory",
      path: "../factories/implementation-factories/DropdownValueFactory",
    },
  },
};
