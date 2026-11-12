/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "FORM",
  language: "en",
  tags: ["Mouse", "Pup", "Development", "Milestones", "Eye opening"],
  internal: {
    edition: 1,
    name: "MOUSE_DEVELOPMENTAL_MILESTONES_FORM",
  },
  defaultMeasureVisibility: "visible",
  content: {
    toothEruption: {
      kind: "boolean",
      variant: "radio",
      label: "Tooth eruption (optional)",
      description: "Usually at P11, before eye opening",
      options: {
        true: "Yes",
        false: "No",
      },
    },
    toothEruptionNotes: {
      kind: "string",
      variant: "input",
      label: "Tooth eruption notes (optional)",
    },
    eyeOpening: {
      kind: "boolean",
      variant: "radio",
      label: "Eye opening (optional)",
      description: "Usually at P11 to P12",
      options: {
        true: "Yes",
        false: "No",
      },
    },
    eyeOpeningNotes: {
      kind: "string",
      variant: "input",
      label: "Eye opening notes (optional)",
    },
    furCoatFull: {
      kind: "boolean",
      variant: "radio",
      label: "Fur coat full (optional)",
      description: "Usually at P10",
      options: {
        true: "Yes",
        false: "No",
      },
    },
    furCoatFullNotes: {
      kind: "string",
      variant: "input",
      label: "Fur coat full notes (optional)",
    },
    nippleVisibility: {
      kind: "boolean",
      variant: "radio",
      label: "Nipple visibility (female pups) (optional)",
      description: "Usually at P9 to P10",
      options: {
        true: "Yes",
        false: "No",
      },
    },
    nippleVisibilityNotes: {
      kind: "string",
      variant: "input",
      label: "Nipple visibility (female pups) notes (optional)",
    },
    rightingReflex: {
      kind: "number",
      variant: "input",
      label: "Righting reflex (seconds) (optional)",
    },
    gripReflex: {
      kind: "boolean",
      variant: "radio",
      label: "Grip reflex (optional)",
      options: {
        true: "Yes",
        false: "No",
      },
    },
    sexDetermined: {
      kind: "string",
      variant: "radio",
      label: "Sex determined (optional)",
      description:
        "Fill in if the sex of the pup was unknown in the mouse origin form and is now known",
      options: {
        Male: "Male",
        Female: "Female",
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
      "To be filled in whenever a pup is checked for developmental milestones. All questions are optional, answer only the milestones that were checked.",
    ],
  },
  details: {
    description:
      "A form to track the developmental milestones of a mouse pup.",
    license: "Apache-2.0",
    title: "Mouse Developmental Milestones Form",
  },
  measures: {
    toothEruption: {
      kind: "const",
      ref: "toothEruption",
    },
    toothEruptionNotes: {
      kind: "const",
      ref: "toothEruptionNotes",
    },
    eyeOpening: {
      kind: "const",
      ref: "eyeOpening",
    },
    eyeOpeningNotes: {
      kind: "const",
      ref: "eyeOpeningNotes",
    },
    furCoatFull: {
      kind: "const",
      ref: "furCoatFull",
    },
    furCoatFullNotes: {
      kind: "const",
      ref: "furCoatFullNotes",
    },
    nippleVisibility: {
      kind: "const",
      ref: "nippleVisibility",
    },
    nippleVisibilityNotes: {
      kind: "const",
      ref: "nippleVisibilityNotes",
    },
    rightingReflex: {
      kind: "const",
      ref: "rightingReflex",
    },
    gripReflex: {
      kind: "const",
      ref: "gripReflex",
    },
    sexDetermined: {
      kind: "const",
      ref: "sexDetermined",
    },
    additionalComments: {
      kind: "const",
      ref: "additionalComments",
    },
  },
  validationSchema: z.object({
    toothEruption: z.boolean().optional(),
    toothEruptionNotes: z.string().optional(),
    eyeOpening: z.boolean().optional(),
    eyeOpeningNotes: z.string().optional(),
    furCoatFull: z.boolean().optional(),
    furCoatFullNotes: z.string().optional(),
    nippleVisibility: z.boolean().optional(),
    nippleVisibilityNotes: z.string().optional(),
    rightingReflex: z.number().int().min(0).optional(),
    gripReflex: z.boolean().optional(),
    sexDetermined: z.enum(["Male", "Female"]).optional(),
    additionalComments: z.string().optional(),
  }),
});
