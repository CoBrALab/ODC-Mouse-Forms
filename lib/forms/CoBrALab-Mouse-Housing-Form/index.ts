/* eslint-disable perfectionist/sort-objects */

import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core'
import { z } from '/runtime/v1/zod@3.23.x'

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Housing','Cage Enrichment','Room Change','Cage Change', 'Cage'],
  internal: {
    edition: 3,
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
    cageIdentificationType: {
      kind: "string",
      variant: "select",
      label: "Cage Identification Type",
      options: {
        "AMS Number": "AMS Number",
        "Other": "Other"
      }
    },
    cageIdentification: {
      kind: 'dynamic',
      deps: ['cageIdentificationType'],
      render(data) {
        if(data.cageIdentificationType === 'AMS Number') {
          return {
            kind: "string",
            variant:"input",
            label: "AMS Cage Number"
          }
        }
        else if (data.cageIdentificationType === 'Other'){
          return {
            kind: "string",
            variant: "input",
            label: "Other identification name"
          }
        }
        return null
      }
    },
    additionalCageName: {
      kind: "string",
      variant: "input",
      label: "If the cage was given an additional name/identification please enter it here."
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
    },
    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
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
    cageIdentificationType: {
      kind: "const",
      label: "Cage Identification Given",
      ref: "cageIdentificationType"
    },
    cageIdentification: {
      kind: "const",
      label: "Cage Identification",
      ref: "cageIdentification"
    },
    additionalCageName: {
      kind: "const",
      label: "Cage number",
      ref: "additionalCageName"
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
    },
    additionalComments: {
      kind: "const",
      ref: "additionalComments"
    }
  },
  validationSchema: z.object({
    roomNumber: z.string(),
    totalMice: z.number().int().min(0),
    cageIdentificationType: z.enum(['AMS Number', 'Other']),
    cageIdentification: z.string(),
    additionalCageName: z.string().optional(),
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
    additionalComments: z.string().optional()

  })
});
