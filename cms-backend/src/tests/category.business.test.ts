import request from "supertest";
import app from "../app";

describe("Category Business Logic", () => {
  it("should return 400 if category is used by articles", async () => {
    const res = await request(app)
      .delete("/api/categories/cat-1")
      .set("x-role", "admin");

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/used/i);
  });
});