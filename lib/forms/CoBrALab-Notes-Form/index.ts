/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "FORM",
  language: "en",
  tags: ["Mouse", "Notes", "Incident", "Health", "Wellness"],
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
    ],
  },
  details: {
    description:
      "A form to keep notes on the health of a mouse and on unpredictable cage, room or facility events.",
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
    noteDescription: {
      kind: "const",
      visibility: "visible",
      ref: "noteDescription",
    },
  },
  validationSchema: z.object({
    noteCategory: z.enum(["Animal health", "Cage event", "Room event", "Other"]),
    healthObservations: z
      .set(
        z.enum(["Over-grooming", "Fighting", "Cataract", "Scratches", "Other"])
      )
      .optional(),
    noteDescription: z.string().min(1),
  }),
});
