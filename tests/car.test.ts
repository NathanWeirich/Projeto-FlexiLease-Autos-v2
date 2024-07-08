import request from "supertest";
import app from "../src/app";

describe("Car Routes", () => {
  const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hdGhhbkBlbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1NiJ9.uAqQNHi7kY5utAH4G6uTh3sBnmnHpfQghicNyb8FSRY";
  let carId: string;
  let carAccessoryId: string;

  it("should register a new car", async () => {
    const response = await request(app)
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
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    carId = response.body._id;
    carAccessoryId = response.body.accessories[0]._id;
  });

  it("should get all cars", async () => {
    const response = await request(app)
      .get("/api/v1/car")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("cars");
    expect(response.body.cars.length).toBeGreaterThan(0);
  });

  it("should get a car by ID", async () => {
    const response = await request(app)
      .get(`/api/v1/car/${carId}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", carId);
  });

  it("should update a car by ID", async () => {
    const response = await request(app)
      .put(`/api/v1/car/${carId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({
        model: "GM S10 2.0",
        color: "black",
        year: "2023",
        value_per_day: 50,
        accessories: [
          { description: "air conditioner" },
          { description: "4x4 traction" },
          { description: "4 ports" },
        ],
        number_of_passengers: 5,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("color", "black");
  });

  it("should update a car accessory", async () => {
    const response = await request(app)
      .patch(`/api/v1/car/${carId}/accessories/${carAccessoryId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({ description: "updated accessory" });
    expect(response.status).toBe(200);

    const updatedAccessory = response.body.car.accessories.find(
      (acc: { _id: string }) => acc._id === carAccessoryId,
    );

    expect(updatedAccessory).toBeDefined();
    expect(updatedAccessory).toHaveProperty("description", "updated accessory");
  });

  it("should delete a car by ID", async () => {
    const response = await request(app)
      .delete(`/api/v1/car/${carId}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(204);
  });

  // Testes com falha
  it("should return 400 for invalid car ID format", async () => {
    const response = await request(app)
      .get("/api/v1/car/000000")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(400);
  });

  it("should return 404 for non-existent car ID", async () => {
    const response = await request(app)
      .get("/api/v1/car/668c0d8388ac3c8c8135284b")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(404);
  });

  it("should return 401 for missing authorization token", async () => {
    const response = await request(app).get(`/api/v1/car/${carId}`);
    expect(response.status).toBe(401);
  });

  it("should return 403 for invalid authorization token", async () => {
    const invalidToken = "00000000";
    const response = await request(app)
      .get(`/api/v1/car/${carId}`)
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.status).toBe(403);
  });

  it("should return 400 for missing description in accessory update", async () => {
    const response = await request(app)
      .patch(`/api/v1/car/${carId}/accessories/${carAccessoryId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({});
    expect(response.status).toBe(400);
  });

  it("should return 404 for non-existent accessory ID", async () => {
    const response = await request(app)
      .patch(`/api/v1/car/${carId}/accessories/60d0fe4f5300000000a109ca`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({ description: "accessory inexist" });
    expect(response.status).toBe(404);
  });
});
