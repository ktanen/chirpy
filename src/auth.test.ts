import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, getBearerToken, getAPIKey } from "./auth.js";
import { Request } from "express";

describe("JWTs", () => {
  it("creates a token that validates", () => {
    // make token
    const userID = "user123";
    const password = "badSecret";
    const expiresIn = 86400; //1 day from creation
    const token = makeJWT(userID, expiresIn, password);
    // validate token
    const returnedUserID = validateJWT(token, password);
    // expect returned user ID to match
    expect(returnedUserID).toBe(userID);
  });

  it("rejects expired tokens", () => {
    // make a token that expires quickly or is already expired
    const userID = "user123";
    const password = "badPassword";
    const expiresIn = -3600; //1 hour before creation

    const token = makeJWT(userID, expiresIn, password);



    // validate and expect an error

    expect(() => {
        validateJWT(token, password);
    }).toThrow();

  });

  it("rejects tokens signed with the wrong secret", () => {
    // make token with one secret
    const userID = "user123";
    const password = "badSecret";
    const expiresIn = 86400; //1 day from creation
    const wrongPassword = "wrongSecret";

    const token = makeJWT(userID, expiresIn, password);


    // validate with another
    // expect an error

    expect(() => {
        validateJWT(token, wrongPassword);
    }).toThrow();

  });
});


describe("Bearer Token", () => {
    it("Correctly gets the token string from the header", () => {
        const fakeRequest = {
            get: (header: string) => "Bearer tokenString"
        } as unknown as Request;

        const token = getBearerToken(fakeRequest);

        expect(token).toBe("tokenString");
    });

    it("Throws an error when the token value is undefined", () => {
        const fakeRequest = {
            get: (header: string) => undefined
        } as unknown as Request;

        expect(() => {
            getBearerToken(fakeRequest);
        }).toThrow();
        
    });

    it("Throws an error when the authorization header is malformed", () => {
        const fakeRequest = {
            get: (header: string) => "Test tokenString"
        } as unknown as Request;

        expect(() => {
            getBearerToken(fakeRequest);
        }).toThrow();
    });

});

describe("API Key", () => {
   it("Correctly gets the token string from the header", () => {
        const fakeRequest = {
            get: (header: string) => "ApiKey tokenString"
        } as unknown as Request;

        const key = getAPIKey(fakeRequest);

        expect(key).toBe("tokenString");
    });

    it("Throws an error when the token value is undefined", () => {
        const fakeRequest = {
            get: (header: string) => undefined
        } as unknown as Request;

        expect(() => {
            getAPIKey(fakeRequest);
        }).toThrow();
        
    });

    it("Throws an error when the authorization header is malformed", () => {
        const fakeRequest = {
            get: (header: string) => "Test apiKeyString"
        } as unknown as Request;

        expect(() => {
            getAPIKey(fakeRequest);
        }).toThrow();
    });

});