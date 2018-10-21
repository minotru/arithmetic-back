const text = `
11,10,20,30,40,50,60,70,80,90,12,13,21,22,23,31,32,33,41,42,43:4
51,52,53,61,62,63,71,72,73,81,82,83,91,94,93:44
111-113,121-123,131-133,211-213,221-223,231-233,311-313,321-323,331-333,411-413,421-423,431-433,611-613,621-623,631-633,711-713,721-723,731-733,811-813,821-823,831-833,911-913,921-923,931-933 ,511-513,521-523,531-533
`;
const lines = text.split('\n').slice(1, -1);

function parseParts(line) {
  return line.replace(/\s/g, '').split(':').map(part => part.split(','));
}

function makeObject(parts) {
  return {
    values: parts[0],
    ranges: parts[1],
  };
}

const rules = lines.map(line => makeObject(parseParts(line)));
console.log(JSON.stringify(rules, null, 2));
