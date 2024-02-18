export async function sleep(ms: number = 100) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
