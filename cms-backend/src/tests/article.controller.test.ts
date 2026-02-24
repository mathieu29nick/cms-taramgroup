import request from "supertest";
import app from "../app";

describe("POST /api/articles", () => {
  it("should create article as admin", async () => {
    const res = await request(app)
      .post("/api/articles")
      .set("x-role", "admin")
      .send({
        title: "Test Article",
        content: "A".repeat(60),
        excerpt: "Short excerpt",
        author: "Admin User",
        categories: ["cat-1"],
        network: "1",
        featured: false,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should block editor delete", async () => {
    const res = await request(app)
      .delete("/api/articles/some-id")
      .set("x-role", "editor");

    expect(res.status).toBe(403);
  });
});