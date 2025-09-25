import * as express from "express";
import * as jwt from "jsonwebtoken";

let adminRight = {
    read:["*"],
    create:["*"],
    write: ["*"],
    delete: ["*"]
};
let userRight = {
    read:["*"],
    create: ["book"],
    write: [],
    delete: []
};
let managerRight = {
    read:["*"],
    create:["*"],
    write: ["*"],
    delete: ["bookCopy"]
};

function hasRight(rights: { [key: string]: string[] }, action: string, resource: string): boolean {
    return rights[action]?.includes("*") || rights[action]?.includes(resource);
}

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "jwt") {
        const token = request.headers["authorization"];

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));
            } else {

            jwt.verify(token, "your_secret_key",
                function(erreur, decoded : any) {
                    if(scopes !== undefined) {
                        const role : string = decoded.username;
                        let rights;
                        if (role === "admin") rights = adminRight;
                        else if (role === "user") rights = userRight;
                        else if (role === "manager") rights = managerRight;
                        else {
                            return reject(new Error("Invalid role"));
                        }
                        const [action, ressources] = scopes[0].split(":");
                        if (!hasRight(rights, action, ressources)) {
                            return reject(new Error("Insufficient rights"));
                        }
                    }
                    resolve(decoded);
                }

                );
            }
        });
    } else {
        throw new Error("Only support JWT authentication");
    }
}

