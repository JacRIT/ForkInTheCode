describe("Skill Search", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SkillSearch");
    cy.server();
  });

  it("Skill search by zip code SUCCESS", () => {
    cy.route({
      method: "GET",
      url:
        Cypress.env("REACT_APP_SERVER_URL") +
        "/skills/search?zipCode=14623&organization=",
      status: 200,
      response: [
        { name: "PHP", numJobs: 10, _id: 1 },
        { name: "MySQL", numJobs: 8, _id: 2 },
      ],
    }).as("submitSearch");
    cy.get("#zipcode").type("14623");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 200);
    cy.contains("PHP");
    cy.contains("MySQL");
  });

  it("Skill search by zip code FAILURE", () => {
    cy.route({
      method: "GET",
      url:
        Cypress.env("REACT_APP_SERVER_URL") +
        "/skills/search?zipCode=20000&organization=",
      status: 400,
      response: "Bad request",
    }).as("submitSearch");
    cy.get("#zipcode").type("20000");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 400);
    cy.contains("Failed to search for skills");
  });

  it("Zip code not 5 digits FAILURE", () => {
    cy.get("#zipcode").type("111");
    cy.get("#submit").click();
    cy.contains("Must be a 5-digit zip code");
  });

  it("Skill search by organization SUCCESS", () => {
    cy.route({
      method: "GET",
      url:
        Cypress.env("REACT_APP_SERVER_URL") +
        "/skills/search?zipCode=&organization=Apple",
      status: 200,
      response: [
        { name: "PHP", numJobs: 10, _id: 1 },
        { name: "MySQL", numJobs: 8, _id: 2 },
      ],
    }).as("submitSearch");
    cy.get("#organization-tab").click();
    cy.get("#organization").type("Apple");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 200);
    cy.contains("PHP");
    cy.contains("MySQL");
  });

  it("Skill search by organization FAILURE", () => {
    cy.route({
      method: "GET",
      url:
        Cypress.env("REACT_APP_SERVER_URL") +
        "/skills/search?zipCode=&organization=Fake Company",
      status: 400,
      response: "Bad request",
    }).as("submitSearch");
    cy.get("#organization-tab").click();
    cy.get("#organization").type("Fake Company");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 400);
    cy.contains("Failed to search for skills");
  });

  it("Skill search toggle include skills from profile", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        skills: [{ name: "PHP", _id: 1 }],
      },
    }).as("updatedProfileSkills");
    cy.fakeLogin();
    cy.route({
      method: "GET",
      url:
        Cypress.env("REACT_APP_SERVER_URL") +
        "/skills/search?zipCode=12345&organization=",
      status: 200,
      response: [
        { name: "PHP", numJobs: 10, _id: 1 },
        { name: "MySQL", numJobs: 8, _id: 2 },
      ],
    }).as("submitSearch");
    cy.get("#SkillSearch").click();
    cy.get("#zipcode").type("12345");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 200);
    cy.get("#results").should("not.contain", "PHP");
    cy.contains("MySQL");
    cy.get("#includeProfileSkillsToggle").click();
    cy.contains("PHP");
    cy.get("#addCheckbox1").should("be.disabled");
    cy.contains("MySQL");
    cy.get("#includeProfileSkillsToggle").click();
    cy.should("not.contain", "PHP");
    cy.contains("MySQL");
  });
});
