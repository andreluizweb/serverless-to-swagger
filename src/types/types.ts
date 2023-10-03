export type ServerlessConfig = {
  service: string;
  configValidationMode: string;
  frameworkVersion: string;
  plugins: string[];
  provider: {
    name: string;
    runtime: string;
    region: string;
    stage: string;
    tracing: {
      apiGateway: boolean;
      lambda: boolean;
    };
    versionFunctions: boolean;
    apiGateway: {
      shouldStartNameWithService: boolean;
      metrics: boolean;
    };
    iam: {
      role: {
        statements: {
          Effect: string;
          Actions: string[];
          Resource: string[];
        }[];
      };
    };
    environment: {
      [key: string]: string;
    };
  };
  resources: {
    Resources: {
      [key: string]: any;
    };
  };
  custom: {
    [key: string]: any;
  };
  functions: {
    [key: string]: {
      handler: string;
      timeout?: number;
      tags?: Record<string, string>;
      events: {
        http?: {
          path: string;
          tags?: Record<string, string>;
          method: string;
          cors?: boolean;
          private?: boolean;
          summary?: string;
          request?: {
            parameters?: {
              paths?: Record<string, string>;
            } | null;
            schemas?: {
              "application/json": {
                name: string;
                schema: string;
              };
            };
          };
        };
      }[];
    };
  };
  package: {
    individually: boolean;
  };
};

export type Swagger = {
  swagger: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: {
    [key: string]: {
      [key: string]: {
        summary?: string;
        tags?: string[];
        parameters?: {
          name: string;
          in: string;
          required: boolean;
          schema: {
            type: string;
          };
        }[];
        requestBody?: {
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
        };
        responses: {
          [key: string]: {
            description: string;
          };
        };
      };
    };
  };
  definitions: {
    [key: string]: any;
  };
};

export type PackageJson = {
  name: string;
  version: string;
  description: string;
  main: string;
  scripts: {
    [key: string]: string;
  };
  keywords: string[];
};
