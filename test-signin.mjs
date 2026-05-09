import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://handsome-pika-878.convex.cloud");

async function run() {
  try {
    console.log("Attempting signIn...");
    // Convex Auth mutations are handled via standard mutations, usually `auth:signIn` or similar.
    // However, it's easier to just call the sendVerificationRequest directly via a test action!
  } catch (e) {
    console.error("Caught error:", e);
  }
}
run();
