/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Housing','Cage Enrichment','Room Change','Cage Change'],
  internal: {
    edition: 1,
    name: 'MOUSE_HOUSING_FORM'
  },
  content: {
    roomNumber: {
      kind: 'string',
      variant: "input",
      label: "Room number"
    },
    totalMice: {
      kind: "number",
      variant: "input",
      label: "Number of mice in cage"
    },
    cageNumber: {
      kind: "number",
      variant: "input",
      label: "Cage number"
    },
    beddingType: {
      kind: 'string',
      variant: "radio",
      label: "Bedding type",
      options: {
        "Corncob": "Corncob",
        "Woodchip": "Woodchip"
      }
    },
    cageChangeDay: {
      kind: "string",
      variant: "select",
      label: "Cage change day",
      options: {
        "Monday": "Monday",
        "Tuesday": "Tuesday",
        "Wednesday": "Wednesday",
        "Thursday": "Thursday",
        "Friday": "Friday",
        "Saturday": "Saturday",
        "Sunday": "Sunday"
      }
    },
    bottleType: {
      kind: "string",
      variant: "radio",
      label: "Bottle type",
      options: {
        "Auto Bottle": "Auto Bottle",
        "Standard": "Standard"
      }
    },
    cageType: {
      kind: "string",
      variant: "radio",
      label: "Cage type",
      options: {
        "Enriched": "Enriched",
        "Standard": "Standard"
      }
    },
    cageEnrichment: {
      kind: "dynamic",
      deps: ["cageType"],
      render(data) {
        if(data.cageType === 'Enriched'){
           return {
            kind: "set",
            variant: "listbox",
            label: "Forms of enrichment",
            options: {
              "Wheel":"Wheel",
              "Cover": "Cover",
              "Tube": "Tube",
              "Enlarged Cage": "Enlarged Cage"
            }
           }
        }
        return null
      }
    }
  },
  details: {
    description: "Form to describe a mouse's housing",
    estimatedDuration: 1,
    instructions: ["A form used to describe a mouse's housing. Please fill out this form whenever a mouse's housing is changed."],
    license: 'UNLICENSED',
    title: 'Mouse Housing Form'
  },
  measures: {
    roomNumber: {
      kind: "const",
      label: "Room number",
      ref: "roomNumber"
    },
     totalMice: {
      kind: "const",
      label: "Number of mice in cage",
      ref: "totalMice"
    },
    cageNumber: {
      kind: "const",
      label: "Cage number",
      ref: "cageNumber"
    },
    beddingType: {
      kind: "const",
      label: "Bedding type",
      ref: "beddingType"
    },
    cageChangeDay: {
      kind: "const",
      label: "Cage change day",
      ref: "cageChangeDay"
    },
    bottleType: {
      kind: "const",
      label: "Bottle type",
      ref: "bottleType"
    },
    cageType: {
      kind: "const",
      label: "Cage type",
      ref: "cageType"
    },
    cageEnrichment: {
      kind: 'computed',
      label: "Cage enrichment",
      value: (data) => {
        
        return data.cageEnrichment ? Array.from(data.cageEnrichment).join(" ") : ""
      }
    }
  },
  validationSchema: z.object({
    roomNumber: z.string(),
    totalMice: z.number(),
    cageNumber: z.number(),
    beddingType: z.string(),
    cageChangeDay: z.string(),
    bottleType: z.string(),
    cageType: z.string(),
    cageEnrichment: z.set(z.enum(['Wheel',"Cover","Tube","Enlarged Cage"])).optional(),

  })
});
