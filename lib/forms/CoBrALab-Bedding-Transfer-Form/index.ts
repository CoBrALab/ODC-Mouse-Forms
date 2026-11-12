/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "FORM",
  language: "en",
  tags: ["Mouse", "Mating", "Bedding", "Timed mating"],
  internal: {
    edition: 1,
    name: "MOUSE_BEDDING_TRANSFER_FORM",
  },
  defaultMeasureVisibility: "visible",
  content: {
    partnerMouse: {
      kind: "string",
      variant: "input",
      label: "ID of the mating partner the bedding came from",
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
      "To be filled in at the time that bedding from the nest of a mating partner is added to the cage of the mouse before a timed mating session.",
    ],
  },
  details: {
    description:
      "A form to track the transfer of bedding from a mating partner's nest to a mouse's cage before timed mating.",
    license: "Apache-2.0",
    title: "Mouse Bedding Transfer Form",
  },
  measures: {
    partnerMouse: {
      kind: "const",
      ref: "partnerMouse",
    },
    additionalComments: {
      kind: "const",
      ref: "additionalComments",
    },
  },
  validationSchema: z.object({
    partnerMouse: z.string().min(1),
    additionalComments: z.string().optional(),
  }),
});
