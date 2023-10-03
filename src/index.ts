import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { PackageJson, ServerlessConfig, Swagger } from "./types/types";

const readServerlessYML = (filePath: fs.PathOrFileDescriptor) => {
  const content = fs.readFileSync(filePath, "utf8");
  return yaml.load(content) as ServerlessConfig;
};

const readJSON = (filePath: fs.PathOrFileDescriptor) => {
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content);
};

const generateSwagger = (
  packageJson: PackageJson,
  serverlessConfig: ServerlessConfig
) => {
  const swagger: Swagger = {
    swagger: "2.0",
    info: {
      title: serverlessConfig.service,
      version: packageJson.version,
      description: packageJson.description,
    },
    paths: {},
    definitions: {},
  };

  const functions = Object.entries(serverlessConfig.functions || {});

  for (const [functionName, functionConfig] of functions) {
    console.log(functionName);
    const { events = [], tags } = functionConfig;
    const category = tags?.category || "default";

    for (const event of events) {
      if (event.http) {
        const {
          path,
          method,
          summary,
          request,
          private: privateMethod,
        } = event.http;

        if (path && method) {
          const normalizedPath = `${path.trim()}`;
          const normalizedMethod = method.toLowerCase();

          if (!swagger.paths[normalizedPath]) {
            swagger.paths[normalizedPath] = {};
          }

          const parameters = [];

          if (privateMethod) {
            parameters.push(
              {
                name: "x-api-key",
                in: "header",
                required: true,
                schema: {
                  type: "string",
                },
              },
              {
                name: "X-Tenant",
                in: "header",
                required: true,
                schema: {
                  type: "string",
                },
              }
            );
          } else {
            parameters.push({
              name: "Authorization",
              in: "header",
              required: true,
              schema: {
                type: "string",
              },
            });
          }

          if (request?.parameters?.paths) {
            for (const path of Object.entries(request.parameters.paths)) {
              parameters.push({
                name: path[0],
                in: "path",
                required: true,
                schema: {
                  type: "string",
                },
              });
            }
          }

          let requestBody:
            | {
                content: {
                  "application/json": {
                    schema: {
                      type: string;
                      properties: {
                        [key: string]: {
                          type: string;
                        };
                      };
                    };
                  };
                };
              }
            | undefined;

          if (["post", "put"].includes(normalizedMethod)) {
            const schemaPathRegex = /(?<=\${file\().*?(?=\)})/;
            const schemaPath = schemaPathRegex.exec(
              request?.schemas?.["application/json"]?.schema || ""
            )?.[0];

            if (schemaPath) {
              const { $schema, ...schema } = readJSON(`src/${schemaPath}`) as {
                $schema: string;
                type: string;
                properties: {
                  [key: string]: {
                    type: string;
                  };
                };
              };

              requestBody = {
                content: {
                  "application/json": {
                    schema,
                  },
                },
              };
            }
          } else {
            requestBody = undefined;
          }

          swagger.paths[normalizedPath][normalizedMethod] = {
            summary,
            tags: [category],
            parameters,
            requestBody,
            responses: {
              200: {
                description: "Success",
              },
            },
          };
        }
      }
    }
  }

  return swagger;
};

const main = () => {
  const serverlessFilePath = "src/serverless.yml";
  const serverlessConfig = readServerlessYML(serverlessFilePath);
  const packageJson = readJSON("package.json");
  const swagger = generateSwagger(packageJson, serverlessConfig);

  // fs.writeFileSync(
  //   "src/serverless.json",
  //   JSON.stringify(serverlessConfig, null, 2)
  // );
  fs.writeFileSync(
    "src/serverless.json",
    JSON.stringify(serverlessConfig, null, 2)
  );
  fs.writeFileSync("src/swagger.json", JSON.stringify(swagger, null, 2));
};

main();
