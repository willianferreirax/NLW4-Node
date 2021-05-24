import request from "supertest";
import { getConnection } from "typeorm";

import { app } from "../app";

import createConnection from "../database"

describe("User", ()=>{
    beforeAll(async()=>{
        const connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async ()=>{
        const connection = getConnection()
        await connection.dropDatabase()
        await connection.close()
    })


    it("Should be able to create a new user", async ()=>{
        const response = await request(app).post("/users")
        .send({
            email: "user@example.com",
            name: "User Example"
        })

        expect(response.status).toBe(201)
    })

    it("Should NOT be able to create a user if the email is already used", async()=>{
        const response = await request(app).post("/users")
        .send({
            email: "user@example.com",
            name: "User Example"
        })

        expect(response.status).toBe(400)
    })

    
    
})