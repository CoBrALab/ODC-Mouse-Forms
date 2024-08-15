/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

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
        "3xTG-AD": "3xTG-AD"
      }
    },
    boxMouse: {
      kind: 'boolean',
      variant: 'radio',
      label: 'External breeder (Box mouse)?'
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
            variant: 'input',
            label: "Origin of breeder"
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
      if(data.boxMouse === false){
        return {
          kind: 'string',
          variant: 'input',
          label: "Id of mouse's father"
        }
      }
      return null
     }
    },
    origin: {
      kind: 'string',
      variant: 'input',
      label: 'Mouse origin'
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
    license: 'UNLICENSED',
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
    motherMouse: {
      kind: 'const',
      label: 'Mother of mouse',
      ref: 'motherMouse'
    },
    fatherKnown: {
      kind: 'const',
      label: 'Father known',
      ref: 'fatherMouse'
    },
    breederOrigin:{
      kind: 'const',
      label: 'Breeder origin',
      ref: 'breederOrigin'
    },
    origin: {
      kind: 'const',
      label: 'Origin',
      ref: 'origin'
    },
    generationNumber: {
      kind: 'const',
      label: 'Generation Number',
      ref: 'generationNumber'
    }
  },
  validationSchema: z.object({
    dateOfBirth: z.date(),
    mouseSex: z.string(),
    cohortId: z.string().optional(),
    boxMouse: z.boolean(),
    mouseStrain: z.string(),
    orderId: z.string().optional(),
    motherMouse: z.string().optional(),
    fatherKnown: z.boolean().optional(),
    fatherMouse: z.string().optional(),
    breederOrigin: z.string().optional(),
    origin: z.string(),
    generationNumber: z.number()})
});