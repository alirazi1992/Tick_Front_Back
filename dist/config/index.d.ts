interface Config {
    env: string;
    port: number;
    apiPrefix: string;
    mongodb: {
        uri: string;
    };
    jwt: {
        secret: string;
        expire: string;
        refreshSecret: string;
        refreshExpire: string;
    };
    cors: {
        allowedOrigins: string[];
    };
    upload: {
        maxFileSize: number;
        uploadPath: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    admin: {
        email: string;
        password: string;
        name: string;
    };
    logging: {
        level: string;
    };
}
declare const config: Config;
export default config;
//# sourceMappingURL=index.d.ts.map