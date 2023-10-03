import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { ServerlessConfig } from "./types/types";

const readServerlessYML = (filePath: fs.PathOrFileDescriptor) => {
  const content = fs.readFileSync(filePath, "utf8");
  return yaml.load(content) as ServerlessConfig;
};

const readSchemaJSON = (filePath: fs.PathOrFileDescriptor) => {
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content);
};

const generateSwagger = (serverlessConfig: ServerlessConfig) => {
  const swagger = {
    swagger: "2.0",
    info: {
      title: "Serverless API",
      version: "1.0",
    },
    paths: {},
    definitions: {},
  };

  const functions = Object.entries(serverlessConfig.functions || {});

  for (const [functionName, functionConfig] of functions) {
    console.log(functionName);
    const { events = [] } = functionConfig;

    for (const event of events) {
      if (event.http) {
        console.log("IS HTTP");
        const httpEvent = event.http;
        const { path, method } = httpEvent;

        if (path && method) {
          const normalizedPath = `${path.trim()}`;
          const normalizedMethod = method.toLowerCase();

          console.log(normalizedPath);
          console.log(normalizedMethod);

          // if (!swagger.paths[normalizedPath]) {
          //   swagger.paths[normalizedPath] = {};
          // }

          // swagger.paths[normalizedPath][normalizedMethod] = {
          //   summary: httpEvent.summary,
          // };
        }
      } else {
        console.log("IS NOT HTTP");
      }
    }
  }

  return swagger;
};

const main = () => {
  const serverlessFilePath = "src/serverless.yml";
  const serverlessConfig = readServerlessYML(serverlessFilePath);
  const swagger = generateSwagger(serverlessConfig);

  // fs.writeFileSync(
  //   "src/serverless.json",
  //   JSON.stringify(serverlessConfig, null, 2)
  // );
  fs.writeFileSync("./swagger.json", JSON.stringify(swagger, null, 2));
};

main();
