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
      events: {
        http?: {
          path: string;
          method: string;
          cors?: boolean;
          private?: boolean;
          request?: {
            parameters?: {
              paths?: string[];
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
