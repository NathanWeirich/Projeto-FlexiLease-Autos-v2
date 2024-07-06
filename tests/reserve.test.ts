import request from "supertest";
import app from "../src/app";

describe("Reserve Routes", () => {
  const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hdGhhbkBlbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1NiJ9.uAqQNHi7kY5utAH4G6uTh3sBnmnHpfQghicNyb8FSRY";
  let reserveId: string;
  let userId: string;
  let unqualifiedUserId: string;
  let carId: string;

  beforeAll(async () => {
    const userResponse = await request(app).post("/api/v1/user").send({
      name: "usertest",
      cpf: "123.456.789-99",
      birth: "01/01/2000",
      email: "teste@mail.com",
      password: "123456",
      cep: "01001000",
      qualified: "sim",
    });
    userId = userResponse.body._id;

    const unqualifiedUserResponse = await request(app)
      .post("/api/v1/user")
      .send({
        name: "usertest",
        cpf: "123.999.999-99",
        birth: "01/01/2000",
        email: "unqualified@mail.com",
        password: "123456",
        cep: "01001000",
        qualified: "não",
      });
    unqualifiedUserId = unqualifiedUserResponse.body._id;

    const carResponse = await request(app)
      .post("/api/v1/car")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        model: "GM S10 2.8",
        color: "White",
        year: "2021",
        value_per_day: 50,
        accessories: [
          { description: "air conditioner" },
          { description: "4x4 traction" },
          { description: "4 ports" },
        ],
        number_of_passengers: 5,
      });
    carId = carResponse.body._id;
  });

  afterAll(async () => {
    await request(app).delete(`/api/v1/user/${userId}`);
    await request(app).delete(`/api/v1/car${carId}`);
  });

  it("should create a new reserve", async () => {
    const response = await request(app)
      .post("/api/v1/reserve")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        id_user: userId,
        id_car: carId,
        start_date: "01/08/2023",
        end_date: "05/08/2023",
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("reserveId");
    reserveId = response.body.reserveId;
  });

  it("should get all reserves", async () => {
    const response = await request(app)
      .get("/api/v1/reserve")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reservations");
    expect(response.body.reservations.length).toBeGreaterThan(0);
  });

  it("should get a reserve by ID", async () => {
    const response = await request(app)
      .get(`/api/v1/reserve/${reserveId}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id_reserve", reserveId);
  });

  it("should update a reserve by ID", async () => {
    const response = await request(app)
      .put(`/api/v1/reserve/${reserveId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        id_user: userId,
        id_car: carId,
        start_date: "02/08/2023",
        end_date: "06/08/2023",
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("start_date", "02/08/2023");
  });

  it("should delete a reserve by ID", async () => {
    const response = await request(app)
      .delete(`/api/v1/reserve/${reserveId}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(204);
  });

  // Testes com falha
  it("should return 400 for invalid reserve ID format", async () => {
    const response = await request(app)
      .get("/api/v1/reserve/invalid-id")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid ID format");
  });

  it("should return 404 for non-existent reserve ID", async () => {
    const response = await request(app)
      .get("/api/v1/reserve/60d0fe4f5311236168a109cc") // Assumindo que este ID não exista
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(404);
  });

  it("should return 401 for missing authorization token", async () => {
    const response = await request(app).get(`/api/v1/reserve/${reserveId}`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Unauthorized");
  });

  it("should return 403 for invalid authorization token", async () => {
    const invalidToken = "invalid.token.here";
    const response = await request(app)
      .get(`/api/v1/reserve/${reserveId}`)
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error", "Forbidden");
  });

  it("should return 400 for missing required fields in reserve creation", async () => {
    const response = await request(app)
      .post("/api/v1/reserve")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        id_user: userId,
        id_car: carId,
        // Missing start_date and end_date
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Validation error");
  });

  it("should return 400 for invalid date format in reserve creation", async () => {
    const response = await request(app)
      .post("/api/v1/reserve")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        id_user: userId,
        id_car: carId,
        start_date: "invalid-date",
        end_date: "invalid-date",
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Validation error");
  });

  it("should return 404 for non-existent user in reserve creation", async () => {
    const response = await request(app)
      .post("/api/v1/reserve")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        id_user: "60d0fe4f5311236168a109cd", // Assumindo que este ID de usuário não exista
        id_car: carId,
        start_date: "01/08/2023",
        end_date: "05/08/2023",
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("should return 404 for non-existent car in reserve creation", async () => {
    const response = await request(app)
      .post("/api/v1/reserve")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        id_user: userId,
        id_car: "60d0fe4f5311236168a109ce", // Assumindo que este ID de carro não exista
        start_date: "01/08/2023",
        end_date: "05/08/2023",
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Car not found");
  });

  it("should return 400 for user not qualified in reserve creation", async () => {
    const response = await request(app)
      .post("/api/v1/reserve")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        id_user: unqualifiedUserId,
        id_car: carId,
        start_date: "01/08/2023",
        end_date: "05/08/2023",
      });
    expect(response.status).toBe(400);
  });

  it("should return 400 for car already reserved in the given period", async () => {
    // Create an initial reserve
    await request(app)
      .post("/api/v1/reserve")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        id_user: userId,
        id_car: carId,
        start_date: "10/08/2023",
        end_date: "15/08/2023",
      });

    // Try to create another reserve for the same car in the overlapping period
    const response = await request(app)
      .post("/api/v1/reserve")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        id_user: userId,
        id_car: carId,
        start_date: "12/08/2023",
        end_date: "17/08/2023",
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "The car is already reserved for the given period",
    );
  });
});
