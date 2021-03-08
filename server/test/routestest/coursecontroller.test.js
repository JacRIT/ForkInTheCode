const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const app = require("../../src/app");
const request = supertest(app);

let session_info = "";

describe("CourseController Tests", () => {
	beforeAll(connectDB);
	afterAll(disconnectDB);

	it("GET /courses - not logged in", async () => {
		const res = await request.get("/courses");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Access Denied.");
	});

	it("POST /courses/course - not logged in", async () => {
		const res = await request.post("/courses/course");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Access Denied.");
	});

	it("PATCH /courses/course - not logged in", async () => {
		const res = await request.patch("/courses/course");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Access Denied.");
	});

	it("DELETE /courses/course - not logged in", async () => {
		const res = await request.delete("/courses/course");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Access Denied.");
	});

	it("POST /register - Job Seeker success", async () => {
		const res = await request
			.post("/register")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({
				email: "tester@gmail.com",
				password: "chicken",
				usertype: "JobSeekerProfile",
			});
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully created Job Seeker user");
	});

	it("POST /login - success", async () => {
		const res = await request
			.post("/login")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({ email: "tester@gmail.com", password: "chicken" });
		session_info = res.header["set-cookie"];
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual(expect.anything());
	});

	it("GET /courses - wrong usertype", async () => {
		const res = await request.get("/courses").set("Cookie", [session_info]);
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});

	it("POST /courses/course - wrong usertype", async () => {
		const res = await request
			.post("/courses/course")
			.set("Cookie", [session_info])
			.send({ location: "1", name: "Name", skills: "skills" });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});

	it("PATCH /courses/course - wrong usertype", async () => {
		const res = await request
			.patch("/courses/course")
			.set("Cookie", [session_info])
			.send({
				location: "1",
				name: "Name",
				skills: ["123", "567"],
				contact: "",
				period: "",
				times: "",
				description: "",
				moneyCost: "",
				timeCost: "",
				requiredEquipment: "",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});

	it("DELETE /courses/course - wrong usertype", async () => {
		const res = await request
			.delete("/courses/course")
			.set("Cookie", [session_info])
			.send({ _id: "123" });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});
});
