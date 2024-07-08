import request from "supertest";
import app from "../src/app";

describe("User Routes", () => {
  let userId: string;
  let duplicateUserId: string;

  beforeAll(async () => {
    const response = await request(app).post("/api/v1/user").send({
      name: "duplicateTestUser",
      cpf: "123.456.789-99",
      birth: "01/01/2000",
      email: "duplicatetestuser@mail.com",
      password: "123456",
      cep: "01001000",
      qualified: "sim",
    });
    duplicateUserId = response.body._id;
  });

  afterAll(async () => {
    await request(app).delete(`/api/v1/user/${duplicateUserId}`);
  });

  it("should register a new user", async () => {
    const response = await request(app).post("/api/v1/user").send({
      name: "test",
      cpf: "123.456.789-10",
      birth: "01/01/2000",
      email: "test@mail.com",
      password: "123456",
      cep: "01001000",
      qualified: "sim",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    userId = response.body._id;
  });

  it("should authenticate the user", async () => {
    const response = await request(app).post("/api/v1/authenticate").send({
      email: "test@mail.com",
      password: "123456",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should get all users", async () => {
    const response = await request(app).get("/api/v1/user");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
    expect(response.body.users.length).toBeGreaterThan(0);
  });

  it("should get a user by ID", async () => {
    const response = await request(app).get(`/api/v1/user/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", userId);
  });

  it("should update a user by ID", async () => {
    const response = await request(app).put(`/api/v1/user/${userId}`).send({
      name: "Updated Test User",
      cpf: "123.456.789-10",
      birth: "01/01/2000",
      email: "updatedtestuser@example.com",
      password: "123456",
      cep: "01001000",
      qualified: "sim",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Updated Test User");
  });

  it("should delete a user by ID", async () => {
    const response = await request(app).delete(`/api/v1/user/${userId}`);
    expect(response.status).toBe(204);
  });

  // Testes com falha
  it("should return 400 for user registration with invalid CPF", async () => {
    const response = await request(app).post("/api/v1/user").send({
      name: "test",
      cpf: "000000",
      birth: "01/01/2000",
      email: "testinvalidcpf@mail.com",
      password: "123456",
      cep: "01001000",
      qualified: "sim",
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 for user registration with invalid email", async () => {
    const response = await request(app).post("/api/v1/user").send({
      name: "test",
      cpf: "123.456.789-11",
      birth: "01/01/2000",
      email: "invalid-email",
      password: "123456",
      cep: "01001000",
      qualified: "sim",
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 for user registration with underage user", async () => {
    const response = await request(app).post("/api/v1/user").send({
      name: "test",
      cpf: "123.456.789-12",
      birth: "01/01/2010",
      email: "underage@mail.com",
      password: "123456",
      cep: "01001000",
      qualified: "sim",
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 for user authentication with wrong email", async () => {
    const response = await request(app).post("/api/v1/authenticate").send({
      email: "wrongemail@mail.com",
      password: "123456",
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 for user authentication with wrong password", async () => {
    const response = await request(app).post("/api/v1/authenticate").send({
      email: "test@mail.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 for user update with existing email", async () => {
    const response = await request(app).put(`/api/v1/user/${userId}`).send({
      name: "Updated Test User",
      cpf: "123.456.789-10",
      birth: "01/01/2000",
      email: "duplicatetestuser@mail.com", // Email do usuário duplicado
      password: "123456",
      cep: "01001000",
      qualified: "sim",
    });
    expect(response.status).toBe(409);
  });

  it("should return 400 for user update with existing CPF", async () => {
    const response = await request(app).put(`/api/v1/user/${userId}`).send({
      name: "Updated Test User",
      cpf: "123.456.789-99", // CPF do usuário duplicado
      birth: "01/01/2000",
      email: "updatedtestuser2@example.com",
      password: "123456",
      cep: "01001000",
      qualified: "sim",
    });
    expect(response.status).toBe(409);
  });

  it("should return 404 for deleting non-existing user", async () => {
    const response = await request(app).delete(
      `/api/v1/user/000000000000000000000000`,
    );
    expect(response.status).toBe(404);
  });
});
