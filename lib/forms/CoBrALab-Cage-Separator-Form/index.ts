/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "FORM",
  language: "en",
  tags: ["Mouse", "Housing", "Cage", "Separator", "Dam"],
  internal: {
    edition: 1,
    name: "MOUSE_CAGE_SEPARATOR_FORM",
  },
  defaultMeasureVisibility: "visible",
  content: {
    gestationalDay: {
      kind: "number",
      variant: "input",
      label: "Gestational day (optional)",
    },
    halfCageMateIds: {
      kind: "string",
      variant: "input",
      label: "IDs of the mice in the same half of the cage",
      description: "Separate the IDs with a comma",
    },
    separatorLocation: {
      kind: "string",
      variant: "radio",
      label: "Location",
      options: {
        "Bottom half": "Bottom half of the cage",
        "Top half": "Top half of the cage",
      },
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
      "To be filled in whenever a separator is added to the cage of a mouse.",
    ],
  },
  details: {
    description:
      "A form to track a separator intervention, where a cage is divided into two halves.",
    license: "Apache-2.0",
    title: "Mouse Cage Separator Form",
  },
  measures: {
    gestationalDay: {
      kind: "const",
      ref: "gestationalDay",
    },
    halfCageMateIds: {
      kind: "const",
      ref: "halfCageMateIds",
    },
    separatorLocation: {
      kind: "const",
      ref: "separatorLocation",
    },
    additionalComments: {
      kind: "const",
      ref: "additionalComments",
    },
  },
  validationSchema: z.object({
    gestationalDay: z.number().int().min(0).optional(),
    halfCageMateIds: z.string().min(1),
    separatorLocation: z.enum(["Bottom half", "Top half"]),
    additionalComments: z.string().optional(),
  }),
});
