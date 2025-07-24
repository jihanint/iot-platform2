export async function setupMocks() {
  if (typeof window === "undefined") {
    import("./server").then(({ serverWorker }) => {
      serverWorker.listen();
    });
  } else {
    import("./browsers").then(({ browserWorker }) => {
      browserWorker.start();
    });
  }
}
