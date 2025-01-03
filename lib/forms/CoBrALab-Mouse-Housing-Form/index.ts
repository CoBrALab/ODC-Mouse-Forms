/* eslint-disable perfectionist/sort-objects */

import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core'
import { z } from '/runtime/v1/zod@3.23.x'

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Housing','Cage Enrichment','Room Change','Cage Change', 'Cage'],
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
    cageAmsNumber: {
      kind: "number",
      variant: "input",
      label: "AMS Cage number"
    },
    cageNameGiven: {
      kind: "boolean",
      variant: "radio",
      label: "Cage given addtional name/identification"
    },
    cageName: {
      kind: "dynamic",
      deps: ["cageNameGiven"],
      render(data) {
        if(data.cageNameGiven) {
          return {
            kind: "string",
            variant: "input",
            label: "Additional cage name"
          }
        }
        return null
      }
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
  clientDetails: {
    estimatedDuration: 1,
    instructions: ["Used to log a mouse's housing information. Please fill out this form whenever a mouse's housing is changed or if they moved to a new cage. Changes to a mouse's housing include change in room, type of cage, number of cagemates, and if any cage enrichment is added."]
  },
  details: {
    description: "Describes a mouse's housing details whenever it is moved or changed.",
    license: 'Apache-2.0',
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
    cageAmsNumber: {
      kind: "const",
      label: "Cage number",
      ref: "cageAmsNumber"
    },
    cageNameGiven: {
      kind: "const",
      label: "Cage number",
      ref: "cageNameGiven"
    },
    cageName: {
      kind: "const",
      label: "Cage number",
      ref: "cageName"
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
    totalMice: z.number().int().min(0),
    cageAmsNumber: z.number().int().positive(),
    cageNameGiven: z.boolean(),
    cageName: z.string().optional(),
    beddingType: z.enum(['Corncob','Woodchip']),
    cageChangeDay: z.enum([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ]),
    bottleType: z.enum(['Auto Bottle', 'Standard']),
    cageType: z.enum(['Enriched', 'Standard']),
    cageEnrichment: z.set(z.enum(['Wheel',"Cover","Tube","Enlarged Cage"])).optional(),

  })
});
