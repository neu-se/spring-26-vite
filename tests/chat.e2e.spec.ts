import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { logInUser } from "./testUtils.ts";

let userContext0: BrowserContext;
let userContext1: BrowserContext;
let userContext2: BrowserContext;
let userContext3: BrowserContext;
let page0: Page;
let page1: Page;
let page2: Page;
let page3: Page;
const pages = () => [page0, page1, page2, page3];

test.beforeEach(async ({ browser }) => {
  userContext0 = await browser.newContext();
  userContext1 = await browser.newContext();
  userContext2 = await browser.newContext();
  userContext3 = await browser.newContext();
  page0 = await userContext0.newPage();
  page1 = await userContext1.newPage();
  page2 = await userContext2.newPage();
  page3 = await userContext3.newPage();
  await Promise.all(
    pages().map(async (page, index) =>
      logInUser(page, `user${index}`, `pwd${index}${index}${index}${index}`),
    ),
  );
});

test.afterEach(async ({ browser }) => {
  await userContext0.close();
  await userContext1.close();
  await userContext2.close();
  await userContext3.close();
});

test("set up conversations in the most recent Nim game", async () => {
  await Promise.all(pages().map((page) => page.getByText("A game of Nim").first().click()));

  // Create a message and wait for it to show up for everyone (avoids race conditions in chat)
  for (const [index, page] of pages().entries()) {
    await page.getByPlaceholder("Send a message to chat").focus();
    await page.keyboard.type(`Message from user${index}`);
    await page.keyboard.press("Enter");
    await Promise.all(
      pages().map((p) => expect(p.getByText(`Message from user${index}`)).toBeVisible()),
    );
  }
});

test("starts ten Mine Finder games as user1", async () => {
  for (let i = 0; i < 10; i++) {
    // Create game
    await page1.getByRole("button", { name: "Create New Game" }).click();
    await page1.waitForURL("/game/new");
    await page1.getByLabel("Game selection").focus();
    await page1.getByLabel("Game selection").selectOption("minefinder");
    await page1.keyboard.press("Enter");
    await page1.getByRole("button", { name: "Start Game" }).click();

    // Send chat message
    await page1.getByPlaceholder("Send a message to chat").focus();
    await page1.keyboard.type(`I am here`);
    await page1.keyboard.press("Enter");

    // Return to home page
    await page1.getByText("Home").click();
    await page1.waitForURL("/");
  }
});

test("Makes five comments in the forum", async () => {
  await Promise.all(
    pages().map((page) => page.getByText("New game: multiplayer number guesser!").click()),
  );

  for (const page of pages()) {
    await page
      .getByPlaceholder(/(Be the first to comment)|(Share your thoughts)/)
      .fill("I have something to say!");
    await page.getByRole("button", { name: "Add Comment" }).click();
    await page.getByText("Home").click();
    await page.waitForURL("/");
    await page.getByText("New game: multiplayer number guesser!").click();
  }
});
