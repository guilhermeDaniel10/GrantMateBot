import { Container } from "typedi";
import KafkaClient from "./kafka/kafka-connection";
import { RestCommunicator } from "../communicators/implementation-communicators/RestCommunicator";
import { BASE_URL_DEV, BASE_URL_LOCAL } from "../api/endpoints/aibot-url";
import dotenv from "dotenv";

const dotenvPath = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV}`
  : ".env";
dotenv.config({ path: dotenvPath });

export default async ({
  //sequelizeSchemas,
  controllers,
  repos,
  services,
  communicators,
  factories,
}: {
  //sequelizeSchemas: { name: string; sequelizeSchema: any }[];
  controllers: { name: string; path: string }[];
  repos: { name: string; path: string }[];
  services: { name: string; path: string }[];
  communicators: { name: string; path: string }[];
  factories: { name: string; path: string }[];
}) => {
  try {
    //Initialize Rest Communicator
    try {
      const restCommunicator = new RestCommunicator({
        baseUrl:
          process.env.NODE_ENV == "development" ? BASE_URL_DEV : BASE_URL_LOCAL,
        headers: { "Content-Type": "application/json" },
      });
      Container.set("RestCommunicator", restCommunicator);
    } catch (err) {
      console.log(
        "\x1b[31m",
        "Something went wrong connection to Rest Communicator"
      );
      console.log(err);
    }

    repos.forEach((m) => {
      let repoClass = require(m.path).default;
      let repoInstance = Container.get(repoClass);
      Container.set(m.name, repoInstance);
    });

    factories.forEach((m) => {
      // load the @Service() class by its path
      let factoryClass = require(m.path).default;
      // create/get the instance of the @Service() class
      let factoryInstance = Container.get(factoryClass);
      // rename the instance inside the container
      Container.set(m.name, factoryInstance);
    });

    services.forEach((m) => {
      let serviceClass = require(m.path).default;
      let serviceInstance = Container.get(serviceClass);
      Container.set(m.name, serviceInstance);
    });

    controllers.forEach((m) => {
      // load the @Service() class by its path
      let controllerClass = require(m.path).default;
      // create/get the instance of the @Service() class
      let controllerInstance = Container.get(controllerClass);
      // rename the instance inside the container
      Container.set(m.name, controllerInstance);
    });

    return;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
