/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "FORM",
  language: "en",
  tags: ["Mouse", "Diet", "Food", "Food deprivation"],
  internal: {
    edition: 1,
    name: "MOUSE_DIETARY_INTERVENTION_FORM",
  },
  defaultMeasureVisibility: "visible",
  content: {
    dietType: {
      kind: "string",
      variant: "select",
      label: "Diet type",
      options: {
        "Standard chow": "Standard chow",
        "High fat": "High fat",
        Other: "Other",
      },
    },
    dietTypeOther: {
      kind: "dynamic",
      deps: ["dietType"],
      render(data) {
        if (data.dietType === "Other") {
          return {
            kind: "string",
            variant: "input",
            label: "Other diet type",
          };
        }
        return null;
      },
    },
    feedingRegime: {
      kind: "string",
      variant: "radio",
      label: "Feeding regime",
      options: {
        "Ad libitum": "Ad libitum",
        Restricted: "Restricted (food deprivation)",
      },
    },
    foodGiven: {
      kind: "dynamic",
      deps: ["feedingRegime"],
      render(data) {
        if (data.feedingRegime === "Restricted") {
          return {
            kind: "number",
            variant: "input",
            label: "Amount of food given (in grams)",
          };
        }
        return null;
      },
    },
    foodGivenTo: {
      kind: "dynamic",
      deps: ["feedingRegime"],
      render(data) {
        if (data.feedingRegime === "Restricted") {
          return {
            kind: "string",
            variant: "radio",
            label: "The amount of food was given to",
            options: {
              Mouse: "This mouse only",
              Cage: "All mice in the cage (total for the cage)",
            },
          };
        }
        return null;
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
      "To be filled in whenever the diet of a mouse is changed or when food is given to a mouse during food deprivation.",
    ],
  },
  details: {
    description:
      "A form to track diet changes and food deprivation given to a mouse.",
    license: "Apache-2.0",
    title: "Mouse Dietary Intervention Form",
  },
  measures: {
    dietType: {
      kind: "const",
      ref: "dietType",
    },
    dietTypeOther: {
      kind: "const",
      ref: "dietTypeOther",
    },
    feedingRegime: {
      kind: "const",
      ref: "feedingRegime",
    },
    foodGiven: {
      kind: "const",
      ref: "foodGiven",
    },
    foodGivenTo: {
      kind: "const",
      ref: "foodGivenTo",
    },
    additionalComments: {
      kind: "const",
      ref: "additionalComments",
    },
  },
  validationSchema: z
    .object({
      dietType: z.enum(["Standard chow", "High fat", "Other"]),
      dietTypeOther: z.string().optional(),
      feedingRegime: z.enum(["Ad libitum", "Restricted"]),
      foodGiven: z.number().min(0).optional(),
      foodGivenTo: z.enum(["Mouse", "Cage"]).optional(),
      additionalComments: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.dietType === "Other" && !data.dietTypeOther) {
        ctx.addIssue({
          code: "custom",
          path: ["dietTypeOther"],
          message: "This field is required when the diet type is Other.",
        });
      }
      if (data.feedingRegime === "Restricted") {
        if (data.foodGiven === undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["foodGiven"],
            message: "This field is required when the feeding regime is Restricted.",
          });
        }
        if (!data.foodGivenTo) {
          ctx.addIssue({
            code: "custom",
            path: ["foodGivenTo"],
            message: "This field is required when the feeding regime is Restricted.",
          });
        }
      }
    }),
});
