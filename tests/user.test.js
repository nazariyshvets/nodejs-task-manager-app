import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.js";
import {
  userOneId,
  userOne,
  setupDatabase,
  closeDatabase,
} from "./fixtures/db.js";

beforeEach(setupDatabase);

afterAll(closeDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Nazarii",
      email: "nazar123005@gmail.com",
      password: "the_best_pass!@#",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).toMatchObject({
    name: "Nazarii",
    email: "nazar123005@gmail.com",
  });
  expect(user.password).not.toBe("the_best_pass!@#");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
  const response = await request(app).post("/users/login").send({
    email: "q@q.com",
    password: "no_way_",
  });

  expect(response.status).not.toBe(200);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/giraffe.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Michael",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("Michael");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Paris",
    })
    .expect(400);
});
