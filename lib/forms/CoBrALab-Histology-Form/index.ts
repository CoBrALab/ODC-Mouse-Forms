/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);
const { z } = await import("/runtime/v1/zod@3.23.x/index.js");

export default defineInstrument({
  kind: "FORM",
  language: "en",
  tags: [
    "Serums",
    "Histology",
    "Brain Slicing",
    "Immunohistochemistry",
    "Immunofluorescence",
    "Antibodies"
  ],
  internal: {
    edition: 2,
    name: "HISTOLOGY_FORM",
  },
  content: {
    roomNumber: {
      kind: "string",
      variant: "input",
      label: "Room number",
    },
    histologyType: {
      kind: "string",
      variant: "select",
      label: "Type of Histology used",
      options: {
        "Immunohistochemistry": "Immunohistochemistry",
        "Immunofluorescence": "Immunofluorescence",
      },
    },
    brainStorageConditions: {
      kind: "string",
      variant: "select",
      label: "Type of storage brain was kept in",
      options: {
        "Paraffin": "Paraffin",
        "Frozen": "Frozen",
      },
    },
    wasBrainSliced: {
      kind: "boolean",
      variant: "radio",
      label: "Was brain sliced?",
    },
    brainSliceWidth: {
      kind: "dynamic",
      deps: ["wasBrainSliced"],
      render(data) {
        if (data.wasBrainSliced) {
          return {
            kind: "number",
            variant: "input",
            label: "Width of slices (mm)",
          };
        }
        return null;
      },
    },
    portionOfBrainSliced: {
      kind: "dynamic",
      deps: ["wasBrainSliced"],
      render(data) {
        if (data.wasBrainSliced) {
          return {
            kind: "string",
            variant: "select",
            label: "Portion of brain used",
            options: {
              "Whole brain": "Whole brain",
              "Half brain": "Half brain",
            },
          };
        }
        return null;
      },
    },
    protocolFollowed: {
      kind: "string",
      variant: "select",
      label: "Protocol followed",
      options: {
        "CoBrA Lab": "CoBrA Lab",
        Other: "Other",
      },
    },
    otherProtocolName: {
      kind: "dynamic",
      deps: ["protocolFollowed"],
      render(data) {
        if (data.protocolFollowed === "Other") {
          return {
            kind: "string",
            variant: "input",
            label: "Other protocol name",
          };
        }
        return null;
      },
    },
    antibodiesUsedInfo: {
      kind: "record-array",
      label: "Antibody Info",
      fieldset: {
        antibodyType: {
          kind: "string",
          variant: "radio",
          label: "Type of Antibody",
          options: {
            Primary: "Primary",
            Secondary: "Secondary",
          },
        },
        antibodyName: {
          kind: "string",
          variant: "input",
          label: "Name of Antibody",
        },
        antibodyConcentration: {
          kind: "number",
          variant: "input",
          label: "Antibody Concentration μg/mL",
        },
      },
    },
    serumUsed: {
      kind: "string",
      variant: "select",
      label: "Kind of serum used",
      options: {
        "Donkey serum": "Donkey serum",
        "Goat serum": "Goat serum",
        "Chicken serum": "Chicken serum",
        "Mice serum": "Mice serum",
      },
    },
    batchNumber: {
      kind: "string",
      variant: "input",
      label: "Batch number",
    },
    wasSampleStained: {
      kind: "boolean",
      variant: "radio",
      label: "Was sample stained",
    },
    stainUsed: {
      kind: "dynamic",
      deps: ["wasSampleStained"],
      render(data) {
        if (data.wasSampleStained) {
          return {
            kind: "string",
            variant: "select",
            label: "Stain used",
            options: {
              "GFAP": "GFAP",
              "IBA1": "IBA1",
              "PSYN": "PSYN",
              "TH": "TH",
              "NEUN": "NEUN",
            },
          };
        }
        return null;
      },
    },
    dateStained: {
      kind: "dynamic",
      deps: ["wasSampleStained"],
      render(data) {
        if (data.wasSampleStained) {
          return {
            kind: "date",
            label: "Date sample was stained",
          };
        }
        return null;
      },
    },

    histologyQuantified: {
      kind: "boolean",
      variant: "radio",
      label: "Histology Quantified",
    },

    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }
  },
  details: {
    description:
      "Describes when a section of an animal goes through a histology process. The processes listed in this form are Immunofluorescence and Immunohistochemistry. These are done with Ex-vivo samples usually consisting of slices of the brain.",
    license: "Apache-2.0",
    title: "Histology Form",
  },
  clientDetails: {
    estimatedDuration: 3,
    instructions: [
      "Please fill out this form whenever a Immunofluorescence or Immunohistochemistry task is done upon samples of an animal subject. In order to fill out the form the user must know which antibodies were used, if the sample was stained and if so the stain date, and how much brain tissue they used.",
    ],
  },
  measures: {
    roomNumber: {
      kind: "const",
      visibility: "visible",
      ref:  "roomNumber",
    },
    histologyType: {
      kind: "const",
      visibility: "visible",
      ref:  "histologyType",
    },
    brainStorageConditions: {
      kind: "const",
      visibility: "visible",
      ref:  "brainStorageConditions",
    },
    wasBrainSliced: {
      kind: "const",
      visibility: "visible",
      ref:  "wasBrainSliced",
    },
    brainSliceWidth: {
      kind: "const",
      visibility: "visible",
      ref:  "brainSliceWidth",
    },
    portionOfBrainSliced: {
      kind: "const",
      visibility: "visible",
      ref:  "portionOfBrainSliced",
    },
    protocolFollowed: {
      kind: "const",
      visibility: "visible",
      ref:  "protocolFollowed",
    },
    otherProtocolName: {
      kind: "const",
      visibility: "visible",
      ref:  "otherProtocolName",
    },
    antibodiesUsedInfo: {
      kind: "computed",
      label: "Antibodies used info",
      visibility: "visible",
      value: (data) => {
        const antibodyList = data.antibodiesUsedInfo.map((x) => x);
        let antibodyInfoString = "";
        if (antibodyList) {
          for (const antibody of antibodyList) {
            antibodyInfoString +=
              "Antibody Type: " +
              antibody.antibodyType +
              " Antibody Name: " +
              antibody.antibodyName +
              " Antibody Concentration: " +
              antibody.antibodyConcentration +
              " μg/mL ";
          }
        }

        return antibodyInfoString;
      },
    },
    serumUsed: {
      kind: "const",
      visibility: "visible",
      ref:  "serumUsed",
    },
    batchNumber: {
      kind: "const",
      visibility: "visible",
      ref:  "batchNumber",
    },
    wasSampleStained: {
      kind: "const",
      visibility: "visible",
      ref:  "wasSampleStained",
    },
    stainUsed: {
      kind: "const",
      visibility: "visible",
      ref:  "stainUsed",
    },
    dateStained: {
      kind: "const",
      visibility: "visible",
      ref:  "dateStained",
    },
    histologyQuantified: {
      kind: "const",
      visibility: "visible",
      ref:  "histologyQuantified",
    },
    additionalComments: {
      kind: "const",
      visibility: "visible",
      ref:  "additionalComments"
    }
  },
  validationSchema: z.object({
    roomNumber: z.string(),
    histologyType: z.enum(["Immunohistochemistry", "Immunofluorescence"]),
    brainStorageConditions: z.enum(["Paraffin", "Frozen"]),
    wasBrainSliced: z.boolean(),
    brainSliceWidth: z.number().optional(),
    portionOfBrainSliced: z.enum(["Whole brain", "Half brain"]).optional(),
    protocolFollowed: z.enum(["CoBrA Lab", "Other"]),
    otherProtocolName: z.string().optional(),
    antibodiesUsedInfo: z.array(
      z.object({
        antibodyType: z.enum(["Primary", "Secondary"]),
        antibodyName: z.string(),
        antibodyConcentration: z.number(),
      })
    ),
    serumUsed: z.enum([
      "Donkey serum",
      "Goat serum",
      "Chicken serum",
      "Mice serum",
    ]),
    batchNumber: z.string(),
    wasSampleStained: z.boolean(),
    stainUsed: z.enum(["GFAP", "IBA1", "PSYN", "TH", "NEUN"]).optional(),
    dateStained: z.date().optional(),
    histologyQuantified: z.boolean(),
    additionalComments: z.string().optional()
  }),
});
