import Ajv from "ajv";
import fs from "fs";

const ajv = new Ajv({ strict: false });

// schemas
const collectionSchema = JSON.parse(fs.readFileSync("schema/collection.schema.json", "utf8"));
const traitsSchemaFilePath = process.argv[3];

collectionSchema.properties.items.items.properties.meta.properties.traits.$ref =
  "traits.schema.json";
//  traitsSchemaFilePath;

const traitsSchema = JSON.parse(fs.readFileSync(traitsSchemaFilePath, "utf8"));

// Add referenced schemas
ajv.addSchema(traitsSchema);

// Compile envelope schema
const validate = ajv.compile(collectionSchema);

const dataFilePath = process.argv[2];
const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

// Validate
if (validate(data)) {
  console.log("Collection JSON is valid!");
} else {
  console.error("Validation errors:", validate.errors);
}
