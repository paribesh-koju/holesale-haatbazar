const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("API Collection", () => {
  it("For the user creating and existing", async () => {
    // First user creation
    const response = await request(app).post("/api/users/register").send({
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    //if already exists
    if (!response.body.success) {
      expect(response.body.message).toEqual("User already exists");
    } else {
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toEqual("User registered successfully");
    }
  });

  it("should log in an existing user with valid credentials", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "existing@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.userData.email).toBe("existing@example.com");
  });

  it("should fail login for a user with invalid credentials", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "existing@example.com",
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Password Invalid");
  });

  it("should fail login for a non-existent user", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return 404 for a non-existent user", async () => {
    const fakeToken = jwt.sign(
      { userId: new mongoose.Types.ObjectId(), isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const response = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });
});

describe("Product Test API", () => {
  it("GET Products | Fetch all products", async () => {
    const response = await request(app)
      .get("/api/products/get_all_products")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Products fetched successfully");
  });

  it("GET Products | Fetch New products", async () => {
    const response = await request(app)
      .get("/api/products/new_arrivals")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("New arrivals fetched successfully");
  });

  it("GET Products | Fetch products by store", async () => {
    const response = await request(app)
      .get("/api/products/by_store")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Products fetched successfully");
  });
});

describe("Search the product", () => {
  it("Products Search | products search by product name", async () => {
    const response = await request(app)
      .get("/api/products/search_products")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Products fetched successfully");
  });

  it("Products Search | products search by product name inside store details", async () => {
    const response = await request(app)
      .get("/api/products/search_in_store")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Products fetched successfully");
  });
});

//test token
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjdhZjlhMTE4ZWEzOGQ0MDZjZTYyNSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcxOTIwMzU1MH0.W7kjNa8nfuiIIoe6acuZ-iflhNnG-IYyekjmI0Ov_Uw";
