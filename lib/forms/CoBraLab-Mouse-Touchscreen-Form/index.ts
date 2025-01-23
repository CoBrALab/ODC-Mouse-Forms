/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse, Touchscreen','PVD','5-choice'],
  internal: {
    edition: 2,
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
        "initial touch": "Initial touch",
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
              "acquisition": "Acquisition",
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
      label: 'Chamber number (1-12)',
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
        "Neilson Strawberry Milkshake":"Neilson Strawberry Milkshake",
        "Other": "Other"
      }
    },
    milkshakeBrandOther: {
      kind: 'dynamic',
      deps: ['milkshakeBrand'],
      render(data){
        if(data.milkshakeBrand === 'Other'){
          return {
            kind: 'string',
            variant: "input",
            label: 'Brand Name'
          }
        }
        return null
      }
    },
    milkshakeExpiration: {
      kind: 'date',
      label: "Milkshake batch expiration date"
    },
    foodGiven: {
      kind: 'number',
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
            variant: "textarea",
            label: 'Reason for failure'
           }
        }
        return null
      }
    }
  },
  clientDetails: {
    estimatedDuration: 2,
    instructions: ['Please answer the forms questions as accurately as possible, this form is meant be filled in per mouse used']
  },
  details: {
    description: 'This is a form to collect data from a mouses touchscreen session',
    license: 'Apache-2.0',
    title: 'Mouse Touchscreen form'
  },
  measures: {
    experimentType: {
      kind: 'const',
      label: 'Touchscreen session type',
      ref: 'experimentType'
    },
    experimentStage: {
      kind: 'const',
      label: 'Touchscreen session stage',
      ref: 'experimentStage'
    },
    pvdStage: {
      kind: 'const',
      label: 'PVD session stage',
      ref: 'pvdStage'
    },
    fiveChoiceStage: {
      kind: 'const',
      label: '5-choice session stage',
      ref:'fiveChoiceStage'
    },
    chamberNumber: {
      kind: 'const',
      label: 'Chamber number',
      ref: 'chamberNumber'
    },
    chamberSerialCode: {
      kind: 'const',
      label: 'Chamber serial code',
      ref: 'chamberSerialCode'
    },
    milkshakeExpiration: {
      kind: 'const',
      label: 'Milkshake expiration date',
      ref: 'milkshakeExpiration'
    },
    milkshakeBrand: {
      kind: 'const',
      label: 'Milkshake brand',
      ref: 'milkshakeBrand'
    },
    milkshakeBrandOther: {
      kind: 'const',
      label: 'Other brand',
      ref: 'milkshakeBrandOther'
    },
    foodGiven: {
      kind: 'const',
      label: 'Food given',
      ref: 'foodGiven'
    },
    trialFailed: {
      kind: 'const',
      label: 'Trial failed',
      ref: "trialFailed"
    },
    failureReason: {
      kind: 'const',
      label: 'Reason for failure',
      ref: 'failureReason'
    }

  },
  validationSchema: z.object({
    experimentType: z.enum(["PVD", "5-choice"]),
  experimentStage: z.enum([
    "habituation",
    "habituation2a",
    "habituation2b",
    "initial touch",
    "must touch",
    "must initiate",
    "punish incorrect",
    "full session"
  ]),
  pvdStage: z.enum(["acquisition", "reversal", "re-reversal"]).optional(),
  fiveChoiceStage: z.enum(["4 second stimulus", "2 second stimulus", "Pro trial"]).optional(),
  chamberNumber: z.number().min(1).max(12),
  chamberSerialCode: z.string(),
  milkshakeExpiration: z.date(),
  milkshakeBrand: z.enum(["Neilson Strawberry Milkshake", "Other"]),
  milkshakeBrandOther: z.string().optional(),
  foodGiven: z.number().min(0).max(100),
  trialFailed: z.boolean(),
  failureReason: z.string().optional()
  })
});
