/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Birth', 'Mouse'],
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
       if(!data.boxMouse && data.boxMouse !== undefined){
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
       if(!data.boxMouse && data.boxMouse !== undefined){
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
      if(data.fatherKnown && data.boxMouse !== undefined){
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
    description: 'Form used to track a mouses birth information',
    estimatedDuration: 1,
    instructions: ['Please fill out this form for each new mouse within the lab'],
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
    orderId: z.string().optional(),
    motherMouse: z.string().optional(),
    fatherKnown: z.boolean().optional(),
    fatherMouse: z.string().optional(),
    breederOrigin: z.string(),
    origin: z.string(),
    generationNumber: z.number()})
});