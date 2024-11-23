import fs from "fs/promises";
import path from "path";
import genSchema from "./src/genSchema.js";

async function convertExplicitTraits(collId, collName, inputFile) {
  let rawData;
  let inputJson;

  try {
    rawData = await fs.readFile(inputFile, "utf8");
  } catch (error) {
    console.error(`Error reading file ${inputFile}:`, error);
    process.exit(1);
  }

  try {
    inputJson = JSON.parse(rawData);
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    process.exit(1);
  }

  // generate data in ordmeta format
  const data = {
    id: collId,
    name: collName,
    items: inputJson.map((item) => ({
      id: item.id,
      meta: {
        name: item.meta.name,
        traits: item.meta.attributes.reduce((acc, attr) => {
          acc[attr.trait_type] = attr.value;
          return acc;
        }, {}),
      },
    })),
  };

  // Write the new data JSON
  try {
    await fs.mkdir("out", { recursive: true });
    const dataFile = path.join("out", `${collName}.meta.json`);
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    console.log(`Data JSON written to ${dataFile}`);
  } catch (error) {
    console.error(`Error writing file ${dataFile}:`, error);
    process.exit(1);
  }
}

// Get the input file from command line arguments
const collId = process.argv[2];
const collName = process.argv[3];
const inputFile = process.argv[4];
if (!inputFile) {
  console.error("Usage: node me2meta.js collId collName inputFile");
  process.exit(1);
}
convertExplicitTraits(collId, collName, inputFile);

genSchema(inputFile, path.join("out", `${collName}.schema.json`));
