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
    daysBeforePredictedBirth: {
      kind: "number",
      variant: "input",
      label: "Number of days before predicted birth",
    },
    halfCageMates: {
      kind: "number",
      variant: "input",
      label: "Number of cage mates in the same half of the cage",
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
    daysBeforePredictedBirth: {
      kind: "const",
      ref: "daysBeforePredictedBirth",
    },
    halfCageMates: {
      kind: "const",
      ref: "halfCageMates",
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
    daysBeforePredictedBirth: z.number().int().min(0),
    halfCageMates: z.number().int().min(0),
    separatorLocation: z.enum(["Bottom half", "Top half"]),
    additionalComments: z.string().optional(),
  }),
});
