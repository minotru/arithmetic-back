import * as fs from 'fs';
import * as path from 'path';

// const simple: Object = JSON.parse(readFileSync('./levels/simple.json').toString());
const levelsPath = <string>process.env.LEVELS_DIR;
console.log(levelsPath);

const levels: Object[] = [];

const filenames = fs.readdirSync(levelsPath);
for (const filename of filenames) {
  const content = fs.readFileSync(path.join(levelsPath, filename));
  levels.push(JSON.parse(content.toString()));
}

export { levels };
