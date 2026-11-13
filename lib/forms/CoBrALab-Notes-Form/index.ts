/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "FORM",
  language: "en",
  tags: [
    "Mouse",
    "Notes",
    "Incident",
    "Health",
    "Wellness",
    "Vet Care",
    "Wound Treatment",
  ],
  internal: {
    edition: 1,
    name: "MOUSE_NOTES_FORM",
  },
  content: {
    noteCategory: {
      kind: "string",
      variant: "select",
      label: "Category",
      options: {
        "Animal health": "Wellness and health of the animal",
        "Wound treatment": "Wound treatment by the veterinary team",
        "Cage event": "Cage event or problem (for example a leak)",
        "Room event":
          "Room or facility event or problem (for example an alarm or ventilation work)",
        Other: "Other",
      },
    },
    healthObservations: {
      kind: "dynamic",
      deps: ["noteCategory"],
      render(data) {
        if (data.noteCategory === "Animal health") {
          return {
            kind: "set",
            variant: "listbox",
            label: "Health or stress related observations",
            options: {
              "Over-grooming": "Over-grooming",
              Fighting: "Fighting",
              Cataract: "Cataract",
              Scratches: "Scratches",
              Other: "Other",
            },
          };
        }
        return null;
      },
    },
    woundDateReported: {
      kind: "dynamic",
      deps: ["noteCategory"],
      render(data) {
        if (data.noteCategory === "Wound treatment") {
          return {
            kind: "date",
            label: "Wound reported date",
          };
        }
        return null;
      },
    },
    clinicalCondition: {
      kind: "dynamic",
      deps: ["noteCategory"],
      render(data) {
        if (data.noteCategory === "Wound treatment") {
          return {
            kind: "string",
            variant: "input",
            label: "Clinical condition",
          };
        }
        return null;
      },
    },
    treatmentProvided: {
      kind: "dynamic",
      deps: ["noteCategory"],
      render(data) {
        if (data.noteCategory === "Wound treatment") {
          return {
            kind: "string",
            variant: "input",
            label: "Treatment provided",
          };
        }
        return null;
      },
    },
    treatmentStartDate: {
      kind: "dynamic",
      deps: ["noteCategory"],
      render(data) {
        if (data.noteCategory === "Wound treatment") {
          return {
            kind: "date",
            label: "Treatment start date",
          };
        }
        return null;
      },
    },
    noteDescription: {
      kind: "string",
      variant: "textarea",
      label: "Description",
    },
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: [
      "To be filled in whenever there is an observation, issue or event related to a mouse that does not fit in another form.",
      "For a wound treatment, use the information written on the card provided by the veterinary team.",
    ],
  },
  details: {
    description:
      "A form to keep notes on the health of a mouse, on wound treatments done by the veterinary team, and on unpredictable cage, room or facility events.",
    license: "Apache-2.0",
    title: "Mouse Notes Form",
  },
  measures: {
    noteCategory: {
      kind: "const",
      visibility: "visible",
      ref: "noteCategory",
    },
    healthObservations: {
      kind: "computed",
      label: "Health or stress related observations",
      visibility: "visible",
      value: (data) =>
        data.healthObservations
          ? Array.from(data.healthObservations).join(" ")
          : "",
    },
    woundDateReported: {
      kind: "const",
      visibility: "visible",
      ref: "woundDateReported",
    },
    clinicalCondition: {
      kind: "const",
      visibility: "visible",
      ref: "clinicalCondition",
    },
    treatmentProvided: {
      kind: "const",
      visibility: "visible",
      ref: "treatmentProvided",
    },
    treatmentStartDate: {
      kind: "const",
      visibility: "visible",
      ref: "treatmentStartDate",
    },
    noteDescription: {
      kind: "const",
      visibility: "visible",
      ref: "noteDescription",
    },
  },
  validationSchema: z.object({
    noteCategory: z.enum([
      "Animal health",
      "Wound treatment",
      "Cage event",
      "Room event",
      "Other",
    ]),
    healthObservations: z
      .set(
        z.enum(["Over-grooming", "Fighting", "Cataract", "Scratches", "Other"])
      )
      .optional(),
    woundDateReported: z.date().optional(),
    clinicalCondition: z.string().optional(),
    treatmentProvided: z.string().optional(),
    treatmentStartDate: z.date().optional(),
    noteDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.noteCategory === "Wound treatment") {
      if (!data.clinicalCondition) {
        ctx.addIssue({
          code: "custom",
          path: ["clinicalCondition"],
          message: "This field is required for a wound treatment.",
        });
      }
    } else if (!data.noteDescription) {
      ctx.addIssue({
        code: "custom",
        path: ["noteDescription"],
        message: "This field is required.",
      });
    }
  }),
});
