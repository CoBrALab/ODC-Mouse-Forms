/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "FORM",
  language: "en",
  tags: ["Mouse", "MRI Habituation", "Sound", "Preyer reflex"],
  internal: {
    edition: 1,
    name: "MRI_HABITUATION_FORM",
  },
  defaultMeasureVisibility: "visible",
  content: {
    roomNumber: {
      kind: "string",
      variant: "input",
      label: "Room number",
    },
    chamberNumber: {
      kind: "string",
      variant: "input",
      label: "Chamber number",
    },
    numberOfPoopPellets: {
      kind: "number",
      variant: "input",
      label: "Number of droppings/poop pellet produced by animal",
    },
    weightOfPoop: {
      kind: "number",
      variant: "input",
      label: "Weight of poop/dropping pellets (grams)",
    },
    preyerReflexTestSuccessful: {
      kind: "boolean",
      variant: "radio",
      label: "Animal passes the preyer reflex test",
    },
    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments",
    },
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: [
      "To be filled in whenever and animal completes a MRI habituation session. On must track information on the location of the session, tracking dropping done by the animal, and room position. The preyer's reflex test must also be completed on the animal before completion of the form. A pre-existing chamber identification system must be referred to when filling out the chamber number section of the form.",
    ],
  },
  details: {
    description:
      "A form to track data from whenever an animal goes through an MRI Habituation session",
    license: "Apache-2.0",
    title: "MRI Habituation Form",
  },
  measures: {
    roomNumber: {
      kind: "const",
      ref: "roomNumber",
    },
    chamberNumber: {
      kind: "const",
      ref: "chamberNumber",
    },
    numberOfPoopPellets: {
      kind: "const",
      ref: "numberOfPoopPellets",
    },
    weightOfPoop: {
      kind: "const",
      ref: "weightOfPoop",
    },
    preyerReflexTestSuccessful: {
      kind: "const",
      ref: "preyerReflexTestSuccessful",
    },
    additionalComments: {
      kind: "const",
      ref: "additionalComments",
    },
  },
  validationSchema: z.object({
    roomNumber: z.string(),
    chamberNumber: z.string(),
    numberOfPoopPellets: z.number().int().min(0),
    weightOfPoop: z.number().min(0),
    preyerReflexTestSuccessful: z.boolean(),
    additionalComments: z.string().optional(),
  }),
});
