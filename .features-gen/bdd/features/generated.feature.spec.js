/** Generated from: bdd\features\generated.feature */
import { test } from "playwright-bdd";

test.describe("Generated Feature", () => {

  test("Successful login", { tag: ["@happy"] }, async ({ Given, page, When, Then }) => {
    await Given("open page \"login\"", null, { page });
    await When("login \"valid_user\"", null, { page });
    await Then("see message \"Welcome\"", null, { page });
  });

  test("Successful login displays products page", { tag: ["@happy"] }, async ({ Given, page, When, Then }) => {
    await Given("open page", null, { page });
    await When("login with valid credentials", null, { page });
    await Then("see message", null, { page });
  });


});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("bdd\\features\\generated.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Successful login": {"pickleLocation":"4:1","tags":["@happy"],"ownTags":["@happy"]},
  "Successful login displays products page": {"pickleLocation":"10:1","tags":["@happy"],"ownTags":["@happy"]},
  "Successful login": {"pickleLocation":"16:1","tags":["@happy"],"ownTags":["@happy"]},
};