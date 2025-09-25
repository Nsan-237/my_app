import request from "supertest";
import app from "../src/app";

describe("Subscription API", () => {
  let token;

  beforeAll(async () => {
    // Login first to get token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "johndoe@test.com", password: "password123" });

    token = loginRes.body.token;
  });

  it("should fetch subscription plans", async () => {
    const res = await request(app)
      .get("/api/subscription/plans")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should allow user to subscribe to a plan", async () => {
    const res = await request(app)
      .post("/api/subscription/subscribe")
      .set("Authorization", `Bearer ${token}`)
      .send({ planId: "basic" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Subscription successful");
  });

  it("should fail without token", async () => {
    const res = await request(app).post("/api/subscription/subscribe").send({ planId: "basic" });

    expect(res.statusCode).toBe(401);
  });
});
