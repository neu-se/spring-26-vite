import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { createAndLoadGame, logInUser } from "./testUtils.ts";

let userContext0: BrowserContext;
let userContext1: BrowserContext;
let userContext2: BrowserContext;
let userContext3: BrowserContext;
let userContext4: BrowserContext;
let page0: Page;
let page1: Page;
let page2: Page;
let page3: Page;
let page4: Page;
const pages = () => [page0, page1, page2, page3];

test.beforeEach(async ({ browser }) => {
  userContext0 = await browser.newContext();
  userContext1 = await browser.newContext();
  userContext2 = await browser.newContext();
  userContext3 = await browser.newContext();
  userContext4 = await browser.newContext();
  page0 = await userContext0.newPage();
  page1 = await userContext1.newPage();
  page2 = await userContext2.newPage();
  page3 = await userContext3.newPage();
  page4 = await userContext4.newPage();
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
  await userContext4.close();
});

async function sendChatMessage(sender: Page, message: string, viewer: Page) {
  await sender.getByPlaceholder("Send a message to chat").focus();
  await sender.keyboard.type(message);
  await sender.keyboard.press("Enter");
  await expect(viewer.getByText(message)).toBeVisible();
}

test("interactively test Nim and Guessing Game", async () => {
  await page2.getByText("A game of Number Guesser").first().click();
  await page2.getByRole("button", { name: "Submit Guess" }).click();
  await page2.getByText("Home").click();

  await createAndLoadGame(page0, page4, "guess", false, false);
  await page0.getByRole("button", { name: "Submit Guess" }).click();
  await page4.getByRole("button", { name: "Submit Guess" }).click();

  await page2.getByText("A game of Nim").first().click();
  await page2.getByRole("button", { name: "Join Game" }).click();
  await sendChatMessage(page2, "I'm playing!", page2);
  await expect(page2.getByText("There are 18 objects left in the pile.")).toBeVisible();
  await page2.getByRole("button", { name: "Take one" }).click();
  await expect(page2.getByText("There are 14 objects left in the pile.")).toBeVisible();
  await page2.getByRole("button", { name: "Take two" }).click();

  await page3.getByText("A game of Nim").first().click();
  await sendChatMessage(page3, "I'm watching!", page2);
  await sendChatMessage(page2, "Hi user 3!", page3);

  await expect(page2.getByText("There are 9 objects left in the pile.")).toBeVisible();
  await page2.getByRole("button", { name: "Take three" }).click();
  await expect(page2.getByText("There are 3 objects")).toBeVisible();

  await sendChatMessage(page3, "Don't screw this up, player 2!", page2);
  await page2.getByRole("button", { name: "Take three" }).click();
  await sendChatMessage(page3, "Oh no!", page2);
});

test("create a new game of Number Guesser", async () => {
  await createAndLoadGame(page0, page4, "guess", false, false);
});
