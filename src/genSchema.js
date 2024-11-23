import fs from "fs/promises";

// Threshold for enums
const ENUM_THRESHOLD = 20;

export default async function genSchema(inFilePath, outFilePath) {
  // Get the input file name from command-line arguments

  if (!inFilePath) {
    console.error("Usage: node generate-schema.mjs <data-file>");
    process.exit(1);
  }

  try {
    // Load JSON data
    const rawData = await fs.readFile(inFilePath, "utf8");
    const data = JSON.parse(rawData);

    // Extract traits and infer schema
    const traitMap = {};

    data.forEach((item) => {
      item.meta.attributes.forEach(({ trait_type, value }) => {
        if (!traitMap[trait_type]) {
          traitMap[trait_type] = new Set();
        }
        traitMap[trait_type].add(value);
      });
    });

    // Generate traits schema
    const traitsSchema = {
      type: "object",
      properties: {},
      required: [],
    };

    Object.entries(traitMap).forEach(([trait, values]) => {
      const uniqueValues = Array.from(values);
      traitsSchema.properties[trait] =
        uniqueValues.length <= ENUM_THRESHOLD
          ? { type: "string", enum: uniqueValues }
          : { type: "string" };
      traitsSchema.required.push(trait);
    });

    // Generate full schema for `items`
    const fullSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "traits.schema.json",
      type: "object",
      properties: traitsSchema.properties,
      required: traitsSchema.required,
    };

    // Save the schema to a file
    await fs.writeFile(outFilePath, JSON.stringify(fullSchema, null, 2));
    console.log("Schema successfully generated and saved to", outFilePath);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

// Run the script
// const [, , inFilePath] = process.argv;
// genSchema(inFilePath);
