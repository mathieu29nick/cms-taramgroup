import * as articleService from "../services/article.service";

describe("Article Service", () => {
  it("should create an article with draft status", async () => {
    const data = {
      title: "Test Article",
      content: "A".repeat(60),
      excerpt: "Short excerpt",
      author: "Admin User",
      categories: ["cat-1"],
      network: "1",
      featured: false,
    };

    const article = await articleService.create(data);

    expect(article).toHaveProperty("id");
    expect(article.status).toBe("draft");
    expect(article.title).toBe("Test Article");
  });
});