import { ConvexHttpClient } from "convex/browser";
const client = new ConvexHttpClient("https://handsome-pika-878.convex.cloud");

async function run() {
  try {
    console.log("Calling signIn mutation...");
    // Convex Auth signIn mutation signature
    const result = await client.action("auth:signIn", { 
      provider: "resend-otp", 
      params: { email: "test@example.com" } 
    });
    console.log("Result:", result);
  } catch (e) {
    console.error("Mutation failed with error:", e.toString());
  }
}
run();
