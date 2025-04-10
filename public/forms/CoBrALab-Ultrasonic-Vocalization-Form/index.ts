/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'Frequency', 'Cries','Sound'],
  internal: {
    edition: 1,
    name: 'MOUSE_ULTRASONIC_VOCALIZATION_FORM'
  },
  defaultMeasureVisibility: "visible",
  content: {
    numberOfCrys: {
        kind: "number",
        variant: "input",
        label: "Number of calls/cries the animal subject made during the session."
    },
    soundFrequencyAdjustedFromSOP: {
        kind: "boolean",
        variant: "radio",
        label: "Sound frequency of software chagned from SOP"
    },
    adjustedSoundFrequency: {
        kind: "dynamic",
        deps: ["soundFrequencyAdjustedFromSOP"],
        render(data) {
            if(data.soundFrequencyAdjustedFromSOP){
                return {
                    kind: "number",
                    variant: "input",
                    label:"Adjusted sound frequency captured by software (kHz)"
                }
            }
            return null
        }
    },
    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    },

  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['To be filled in whenever the animal goes through an ultrasonic vocalization session. It is expected to know what SOP is being followed as well as the standard frequency used within it. Keep track of the frequency used if adjusted from the SOP.']
  },
  details: {
    description: 'A form to track data from whenever an animal goes through an ultrasonic vocalization procedure',
    license: 'Apache-2.0',
    title: 'Ultrasonic Vocalization Form'
  },
  measures: {
    numberOfCrys: {
        kind: 'const',
        ref: 'numberOfCrys'
    },
    soundFrequencyAdjustedFromSOP: {
        kind: 'const',
        ref: 'soundFrequencyAdjustedFromSOP'
    },
    adjustedSoundFrequency: {
        kind: 'const',
        ref: 'adjustedSoundFrequency'
    },
    additionalComments: {
      kind: 'const',
      ref: 'additionalComments'
    }

  },
  validationSchema: z.object({
    numberOfCrys: z.number().int().min(0),
    soundFrequencyAdjustedFromSOP: z.boolean(),
    adjustedSoundFrequency: z.number().min(20).max(100).optional(),
    additionalComments: z.string().optional()
  })
});
