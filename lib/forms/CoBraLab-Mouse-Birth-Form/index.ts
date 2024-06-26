/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Birth', 'Mouse'],
  internal: {
    edition: 1,
    name: 'MOUSE_BIRTH_FORM'
  },
  content: {
    dateOfBirth: {
      kind: 'date',
      label: "date of birth"
    },
    boxMouse: {
      kind: 'boolean',
      variant: 'radio',
      label: 'Box mouse'
    },
    motherMouse: {
      kind: 'dynamic',
      deps: ['boxMouse'],
      render(data) {
       if(!data.boxMouse){
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
       if(!data.boxMouse){
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
      if(data.fatherKnown){
        return {
          kind: 'string',
          variant: 'input',
          label: "Id of mouse's father"
        }
      }
      return null
     }
    },
    breederOrigin: {
      kind: 'string',
      variant: 'input',
      label: "Origin of breeder"
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
    title: 'Mouse Birth Form'
  },
  measures: {},
  validationSchema: z.object({
    dateOfBirth: z.date(),
    motherMouse: z.string().optional(),
    fatherKnown: z.boolean().optional(),
    fatherMouse: z.string().optional(),
    breederOrigin: z.string(),
    boxMouse: z.boolean(),
    origin: z.string(),
    generationNumber: z.number()})
});