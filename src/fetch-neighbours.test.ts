const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const pickBySecond = (source: { [i: number]: number[] }) => (i: number) =>
  sleep(1000)
    .then(() => source[i])
    .then((data) => ({ data }));

const fetchNeighbours = pickBySecond({
  1: [2, 3, 4],
  2: [5],
  3: [5],
  4: [6],
  5: [7],
  6: [7],
});

jest.setTimeout(30000);
test("dfs", async () => {
  const fn = jest.fn();
  console.log = fn;

  async function searchGraph(start: number) {
    // put the start node into a queue
    const queue = [start];
    // a set for record node has been visited
    const visited = new Set();

    // until queue has empty, do
    while (queue.length > 0) {
      // shift the head from the queue
      const item = queue.shift();

      // no item in the queue, return
      if (!item) continue;

      // do something to the item
      console.log(item);

      // fetch neighbours
      const neighbours = await fetchNeighbours(item);
      // if there don't have neighbours, skip
      if (!neighbours.data) continue;
      // for each neighbours
      for (const neighbour of neighbours.data) {
        // check the neighbour has visited,
        if (!visited.has(neighbour)) {
          // if not append neighbour into queue, and mark as visited
          queue.push(neighbour);
          visited.add(neighbour);
        }
      }
    }
  }

  await searchGraph(1);
  expect(fn.mock.calls[0]).toIncludeAnyMembers([1]);
  expect(fn.mock.calls[1]).toIncludeAnyMembers([2, 3, 4]);
  expect(fn.mock.calls[2]).toIncludeAnyMembers([2, 3, 4]);
  expect(fn.mock.calls[3]).toIncludeAnyMembers([2, 3, 4]);
  expect(fn.mock.calls[4]).toIncludeAnyMembers([5, 6]);
  expect(fn.mock.calls[5]).toIncludeAnyMembers([5, 6]);
  expect(fn.mock.calls[6]).toIncludeAnyMembers([7]);
});
