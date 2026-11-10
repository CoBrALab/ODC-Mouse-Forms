/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "FORM",
  language: "en",
  tags: ["Mouse", "Dam", "Birth", "Litter", "Pups"],
  internal: {
    edition: 1,
    name: "MOUSE_BIRTH_FORM",
  },
  defaultMeasureVisibility: "visible",
  content: {
    numberOfPups: {
      kind: "number",
      variant: "input",
      label: "Number of pups born in the litter",
    },
    milkSpots: {
      kind: "string",
      variant: "radio",
      label: "Milk spots",
      options: {
        "Milk spots": "Milk spots",
        "No milk spots": "No milk spots",
        Unknown: "Unknown",
      },
    },
    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Notes",
    },
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: [
      "To be filled in for the dam whenever she gives birth to a litter.",
    ],
  },
  details: {
    description: "A form to track the litter a dam gives birth to.",
    license: "Apache-2.0",
    title: "Mouse Birth Form",
  },
  measures: {
    numberOfPups: {
      kind: "const",
      ref: "numberOfPups",
    },
    milkSpots: {
      kind: "const",
      ref: "milkSpots",
    },
    additionalComments: {
      kind: "const",
      ref: "additionalComments",
    },
  },
  validationSchema: z.object({
    numberOfPups: z.number().int().min(0),
    milkSpots: z.enum(["Milk spots", "No milk spots", "Unknown"]),
    additionalComments: z.string().optional(),
  }),
});
