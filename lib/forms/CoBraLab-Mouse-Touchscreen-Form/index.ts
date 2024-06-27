/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse, Touchscreen','PVD','5-choice'],
  internal: {
    edition: 1,
    name: 'MOUSE_TOUCHSCREEN_FORM'
  },
  content: {
    experimentType: {
      kind: 'string',
      variant: 'radio',
      label: "Type of touchscreen session",
      options:{
        "PVD":"PVD (Pairwise Discrimination)",
        "5-choice": "5CSRTT (5 choice serial reaction time task)"
      }
    },
    experimentStage: {
      kind: 'string',
      variant: 'select',
      label: "Experiment stage",
      options: {
        "habituation":"Habituation",
        "habituation2a":"Habituation2a",
        "habituation2b":"Habituation2b",
        "intial touch": "Initial touch",
        "must touch": "Must touch",
        "must initiate": "Must initiate",
        "punish incorrect":"Punish incorrect",
        "full session": "Full session"
      }
    },
    pvdStage: {
      kind: 'dynamic',
      deps: ['experimentType', 'experimentStage'],
      render(data){
        if(data.experimentType === "PVD" && data.experimentStage === "full session"){
          return {
            kind: 'string',
            variant: 'radio',
            label: "PVD experiment stage",
            options: {
              "aquisition": "Aquisition",
              "reversal":"Reversal",
              "re-reversal": "Re-reversal"
            }
          }
        }
        return null
      }
    },
    fiveChoiceStage: {
      kind: 'dynamic',
      deps: ['experimentType', 'experimentStage'],
      render(data){
        if(data.experimentType === "5-choice" && data.experimentStage === "full session"){
          return {
            kind: 'string',
            variant: 'radio',
            label: "5-choice experiment stage",
            options: {
              "4 second stimulus": "4 second stimulus",
              "2 second stimulus": "2 second stimulus",
              "Pro trial": "Pro trial"
            }
          }
        }
        return null
      }
    },
    chamberNumber: {
      kind: 'number',
      variant: 'input',
      label: 'Chamber number'
    },
    chamberSerialCode: {
      kind: 'string',
      variant: 'input',
      label: 'Chamber serial code'
    },
    milkshakeBrand: {
      kind: 'string',
      variant: 'radio',
      label: "Milkshake brand",
      options: {
        "Neilson":"Neilson",
        "other": "other"
      }
    },
    milkshakeBatch: {
      kind: 'string',
      variant: 'input',
      label: "Milkshake batch"
    },
    foodGiven: {
      kind: 'string',
      variant: 'input',
      label: 'Amount of food given (in grams)'
    },
    trialFailed: {
      kind: 'boolean',
      variant: 'radio',
      label: 'Did the mouse fail the session?'
    },
    failureReason: {
      kind: 'dynamic',
      deps: ['trialFailed'],
      render(data) {
        if (data.trialFailed){
           return {
            kind: 'string',
            variant: "input",
            label: 'Reason for failure'
           }
        }
        return null
      }
    }
  },
  details: {
    description: 'This is a form to collect data from a mouses touchscreen session',
    estimatedDuration: 1,
    instructions: ['Please answer the forms questions as accurately as possible, this form is meant be filled in per mouse used'],
    license: 'UNLICENSED',
    title: 'Mouse Touchscreen form'
  },
  measures: {},
  validationSchema: z.object({
    experimentType: z.string(),
    experimentStage: z.string(),
    pvdStage: z.string().optional(),
    fiveChoiceStage: z.string().optional(),
    chamberNumber: z.number().min(1).max(12),
    chamberSerialCode: z.string(),
    milkshakeBatch: z.string(),
    milkshakeBrand: z.string(),
    foodGiven: z.string(),
    trialFailed: z.boolean(),
    failureReason: z.string()


  })
});
