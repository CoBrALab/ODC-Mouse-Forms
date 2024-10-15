/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Birth', 'Mouse','Origin'],
  internal: {
    edition: 1,
    name: 'MOUSE_ORIGIN_FORM'
  },
  content: {
    dateOfBirth: {
      kind: 'date',
      label: "date of birth"
    },
    mouseSex: {
      kind: 'string',
      variant: 'radio',
      label: 'Sex',
      options: {
        "Male": "Male",
        "Female": "Female"
      }
    },
    cohortId: {
      kind: 'string',
      variant: 'input',
      label: 'Cohort Identification (Optional)'
    },
    mouseStrain: {
      kind: "string",
      variant: "select",
      label: "Mouse strain",
      options: {
        "M86-hemi": "M86-hemi",
        "M83-homo": "M83-homo",
        "C57BL/6J": "C57BL/6J",
        "Wild type": "Wild type",
        "5XFAD": "5XFAD",
        "3xTG-AD": "3xTG-AD",
        "Other":"Other"
      }
    },
    otherStrain: {
      kind: "dynamic",
      deps: ["mouseStrain"],
      render(data) {
        if(data.mouseStrain === "Other"){
           return {
            kind : "string",
            variant: "input",
            label: "Other strain"
           }
        }
        return null
      }
    },
    boxMouse: {
      kind: 'boolean',
      variant: 'radio',
      label: 'Originates from external breeder (Box mouse)?'
    },
    orderId: {
      kind: 'dynamic',
      deps: ['boxMouse'],
      render(data) {
        if (data.boxMouse){
          return {
            kind: 'string',
            variant: 'input',
            label: 'Order ID'
          }
        }
        return null
      }
    },
    breederOrigin: {
      kind: 'dynamic',
      deps: ['boxMouse'],
      render(data) {
        if (data.boxMouse){
          return {
            kind: 'string',
            variant: 'select',
            label: "Origin of breeder",
            options: {
              "Charles River Laboratories": "Charles River Laboratories",
              "Envigo": "Envigo",
              "Import": "Import",
              "Jackson Laboratories": "Jackson Laboratories",
              "Other": "Other"
            }
          }
        }
        return null
      }
    },
    otherBreederOrigin: {
      kind: 'dynamic',
      deps: ["breederOrigin"],
      render(data) {
        if(data.breederOrigin === "Other"){
          return {
            kind: "string",
            variant: "input",
            label: "Other external breeder"
          }
        }
        return null
      }
    },
    motherMouse: {
      kind: 'dynamic',
      deps: ['boxMouse'],
      render(data) {
       if(data.boxMouse === false){
         return {
          kind: "string",
          variant: "input",
          label: "Id of mouse's mother"
         }
       }
       return null
      }
    },
    fatherKnown: {
      kind: 'dynamic',
      deps: ['boxMouse'],
      render(data) {
       if(data.boxMouse === false){
         return {
         kind: 'boolean',
         variant: 'radio',
         label: "Is the father known?"
         }
       }
       return null
      }
      
    },
    fatherMouse: {
     kind: 'dynamic',
     deps: ['fatherKnown'],
     render(data) {
      if(data.boxMouse === false && data.fatherKnown){
        return {
          kind: 'string',
          variant: 'input',
          label: "Id of mouse's father"
        }
      }
      return null
     }
    },
    generationNumber: {
      kind: 'number',
      variant: 'input',
      label: 'N-generation of mouse'
    }
  },
  details: {
    description: 'Tracks a mouse\'s birth information, whether it was born within the lab or an exported mouse from an external breeder',
    estimatedDuration: 1,
    instructions: ['Whenever a new mouse is born within the lab, or is exported from an external breeder this form should be filled in to log its information. If the mouse is from an external breeder, information of the breeder as well as the box the mouse came in is expected to be known.'],
    license: 'Apache-2.0',
    title: 'Mouse Origin Form'
  },
  measures: {
   dateOfBirth: {
    kind: 'const',
    label: 'Date of birth',
    ref: 'dateOfBirth'
  },
  mouseSex: {
    kind: 'const',
    label: 'Sex',
    ref: 'mouseSex'
  },
  cohortId: {
    kind: 'const',
    label: 'Cohort',
    ref: 'cohortId'
  },
  mouseStrain: {
    kind: 'const',
    label: 'Mouse Strain',
    ref: 'mouseStrain'
  },
  otherStrain: {
    kind: 'const',
    label: 'Other Strain',
    ref: 'otherStrain'
  },
  boxMouse: {
    kind: 'const',
    label: 'Imported mouse',
    ref: "boxMouse"
  },
  orderId: {
    kind: 'const',
    label: 'Order ID',
    ref: 'orderId'
  },
  breederOrigin: {
    kind: 'const',
    label: 'Breeder origin',
    ref: 'breederOrigin'
  },
  otherBreederOrigin: {
    kind: 'const',
    label: 'Other Breeder',
    ref: 'otherBreederOrigin'
  },
  motherMouse: {
    kind: 'const',
    label: 'Mother of mouse',
    ref: 'motherMouse'
  },
  fatherKnown: {
    kind: 'const',
    label: 'Father known',
    ref: 'fatherKnown'
  },
  fatherMouse: {
    kind: 'const',
    label: 'Father of mouse',
    ref: 'fatherMouse'
  },
  generationNumber: {
    kind: 'const',
    label: 'Generation Number',
    ref: 'generationNumber'
  }
  },
  validationSchema: z.object({
  dateOfBirth: z.date(),
  mouseSex: z.enum(['Male', 'Female']),
  cohortId: z.string().optional(),
  boxMouse: z.boolean(),
  mouseStrain: z.enum([
    'M86-hemi',
    'M83-homo',
    'C57BL/6J',
    'Wild type',
    '5XFAD',
    '3xTG-AD',
    'Other'
  ]),
  otherStrain: z.string().optional(),
  orderId: z.string().optional(),
  motherMouse: z.string().optional(),
  fatherKnown: z.boolean().optional(),
  fatherMouse: z.string().optional(),
  breederOrigin: z.enum([
    'Charles River Laboratories',
    'Envigo',
    'Import',
    'Jackson Laboratories',
    'Other'
  ]).optional(),
  otherBreederOrigin: z.string().optional(),
  generationNumber: z.number().min(1).int()
})
});