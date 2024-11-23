

# Ord Meta -

PURPOSE: conversation starter for inscribing Collection Metadata

The Problems:

1. Many current collection do not use parent-child to establish membership
2. Collection metadata is managed in marketplace-specific ways
3. Evolving Art collections can't update member metadata directly


Solution Prototype:

An obvious direction is to establish consensus on a simple, yet sufficiently expressive standard for collection metadata publishing via an inscription.
The vocab and the level of complexity wants to be more "microformat" like than say, RDF, or a more complex standard.

* To stay in keeping with ordinals, JSON for the metadata format/sytax makes sense.
* The "vocab" for the format would be minimal & extensible upfront.
* Collection specific vocab i.e. metadata fields & types could be describe with JSON Schema & also be inscribed.
* Tooling based on such JSON Schema's can support creator usage.
* Ord-based compression provides for efficient block space usage.
* Ord extension is not be necessary or useful for initial exploration

This method can support "after the fact" publishing of collection membership and item metadata.

It separates out the problem of establishing conventions/standards/practices for find the "official" or "authorized" collection metadata.

Further Thoughts
* Use Reinscription on the initial metadata inscription to update the collection as necessary
* Burning the collection metadata inscription can seal it as would be the case with a parent in parent-child provenance

## Quick Test Run Session

Run this to generate concrete example of outputs which make the rest easier to understand.

```
yarn install
node ME2meta.js eee7404006f2281a12107fc24d2233bd51b5dffd717c4c5eb76494329fdc03e1i0 "Roses for Ordinals by Okra" example/roses.ME.json
node validate.js out/"Roses for Ordinals by Okra".meta.json  out/"Roses for Ordinals by Okra".schema.json
```

## Setup for demonstration

`yarn install`

OR

`npm install`

## Node.js Scripts

1. **ME2meta.js**:
   - Generates a standard metadata and item schema file from MagicEden metadata.
   - Outputs will be places in "out/"
   - Usage: `node ME2meta.js <collectionId> <collectionName> <inputFile>`
   - Example: `node ME2meta.js eee7404006f2281a12107fc24d2233bd51b5dffd717c4c5eb76494329fdc03e1i0 "Roses for Ordinals by Okra" data/roses.ME.json`

2. **validate.js**:
   - Node.js script to validate `out/Roses.meta.json` against the schemas.
   - Handles `$ref` by loading and referencing the traits schema.
   - Usage: `node validate.js`
   - Example: `node validate.js out/"Roses for Ordinals by Okra".meta.json  out/"Roses for Ordinals by Okra".schema.json`



## Inscribing w/ ORD

Set environment variable for $ORD as needed for your setup.

`$ORD wallet inscribe --file out/"Roses for Ordinals by Okra".meta.json --fee-rate 5 --compress`

 - both brotli & gzip do a fine job of getting rid of redundancies
 - SO: just using ord's -compress works for this purpose
 - the 34k file for the 121 supply Roses for Ordinals collection is compressed to ~1200 bytes (10 bytes per item)


# JSON Schema

## Files

1. **schema/collection-schema.json**:
   - Defines the general structure.
   - Includes collection fields including "id" (TBD - an inscription id representing collection)
   - and "meta" for the items in the collection).

2. **example/roses-traits.schema.json**:
   - An example of an items schema that defines "traits" of an item.
   - In this example, includes "k", "palette", and "noise".
   - scripts can generate this from a concrete example as illustrated for Roses in the test run

3. **examples/roses.ME.json**:
   - Sample JSON to validate.
   - Matches the schema structure.
