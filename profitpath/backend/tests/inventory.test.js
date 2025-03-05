import request from "supertest";
import { app, server } from "../index.js"; // ✅ Import the Express app

afterAll(() => {
  server.close(); // ✅ Close the server after tests to prevent open handles
});

describe("Inventory API", () => {
  test("Fetch inventory should return a product list", async () => {
    const response = await request(app).get("/api/inventory?query=iphone");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Invalid query should return 400", async () => {
    const response = await request(app).get("/api/inventory");
    expect(response.status).toBe(400);
  });
});
