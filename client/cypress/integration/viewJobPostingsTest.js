describe("View Job Postings", () => {
  const getJobPostingsSuccessResponse = [
    {
      _id: "1",
      jobTitle: "title1",
      zipCode: "12345",
      salary: "$100,000",
      responsibilities: "responsibilities 1",
      description: "description 1",
      benefits: "benefits",
      skills: [
        {
          description: "desc1",
          name: "skill1",
          _id: "1",
        },
      ],
      organization: { name: "org1" },
      courses: [
        {
          _id: "1",
          location: "Harvard",
          name: "Java 101",
          skills: [
            {
              description: "desc",
              name: "skill1",
              _id: "1",
            },
          ],
          period: "3 Months",
          times: "Monday: 15:00 - 18:00",
          organization: { name: "org1" },
        },
        {
          _id: "2",
          location: "RIT",
          name: "Python 101",
          skills: [
            {
              description: "desc",
              name: "skill2",
              _id: "2",
            },
          ],
          period: "6 Months",
          times: "Tuesday: 10:00 - 12:00",
          organization: { name: "org2" },
        },
      ],
      amountOfJobs: "amountOfJobs1",
      jobTimeline: "jobTimeline1",
    },
    {
      _id: "2",
      jobTitle: "title2",
      zipCode: "54321",
      salary: "$200,000",
      responsibilities: "responsibilities 2",
      description: "description 2",
      benefits: "benefits",
      skills: [
        {
          description: "desc2",
          name: "skill2",
          _id: "2",
        },
      ],
      courses: [
        {
          _id: "1",
          location: "Harvard",
          name: "Java 101",
          skills: [
            {
              description: "desc",
              name: "skill1",
              _id: "1",
            },
          ],
          period: "3 Months",
          times: "Monday: 15:00 - 18:00",
          organization: { name: "org1" },
        },
        {
          _id: "2",
          location: "RIT",
          name: "Python 101",
          skills: [
            {
              description: "desc",
              name: "skill2",
              _id: "2",
            },
          ],
          period: "6 Months",
          times: "Tuesday: 10:00 - 12:00",
          organization: { name: "org2" },
        },
      ],
      organization: { name: "org2" },
      amountOfJobs: "amountOfJobs2",
      jobTimeline: "jobTimeline2",
    },
  ];

  beforeEach(() => {
    // Login first
    cy.fakeLogin("EmployerProfile");
  });

  it("View Job Postings SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobpostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.contains("org1");
    cy.contains("$100,000");
    cy.contains("3 Months");
    cy.contains("Monday: 15:00 - 18:00");
    cy.contains("skill1");
    cy.contains("org1");
    cy.contains("Python 101");
    cy.contains("RIT");
    cy.contains("6 Months");
    cy.contains("Tuesday: 10:00 - 12:00");
    cy.contains("skill2");
    cy.contains("org2");
  });

  it("Load job posting failure", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobpostings",
      status: 400,
      response: "Failed to load Job Postings",
    }).as("getJobPostingsCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 400);
    cy.contains("Failed to load Job Postings");
  });

  it.skip("Navigate to Add Job Postings SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobpostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.get("#addJobPostingsButton").click();
    cy.contains("Add Job Postings");
  });

  it.skip("Navigate to Edit Job Postings SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobpostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.get("#EditJobPostings1").click();
    cy.contains("Edit Job Posting");
    cy.get("#title").should("have.value", "Java 101");
    cy.get("#location").should("have.value", "Harvard");
    cy.get("#period").should("have.value", "3 Months");
    cy.get("#times").should("have.value", "Monday: 15:00 - 18:00");
    cy.contains("skill1");
  });

  it("Delete Job Postings CONFIRM SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobpostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.route({
      method: "DELETE",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobposting",
      status: 200,
      response: "Successfully Deleted",
    }).as("deleteJobPostingCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobpostings",
      status: 200,
      response: [getJobPostingsSuccessResponse[1]],
    }).as("getJobPostingsCall");
    cy.get("#DeleteJobPosting1").click();
    cy.get("#confirmationConfirm").click();
    cy.get("body").should("not.contain", "Java 101");
    cy.contains("A job posting has been successfully deleted!");
  });

  it("Delete Job Postings CANCEL SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobpostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.route({
      method: "DELETE",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobposting",
      status: 200,
      response: "Successfully Deleted",
    }).as("deleteJobPostingCall");
    cy.get("#MyJob Postings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.get("#DeleteJobPosting1").click();
    cy.get("#confirmationConfirm").click();
    cy.contains("Java 101");
  });

  it("Delete Job Postings FAILURE", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobpostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.route({
      method: "DELETE",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobposting",
      status: 400,
      response: "An error has occurred while trying to delete a job posting.",
    }).as("deleteJobPostingCall");
    cy.get("#MyJob Postings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.get("#DeleteJobPosting1").click();
    cy.get("#confirmationConfirm").click();
    cy.contains("An error has occurred while trying to delete a job posting.");
  });
});
