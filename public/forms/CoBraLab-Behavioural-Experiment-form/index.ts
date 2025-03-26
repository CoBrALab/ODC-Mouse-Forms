/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'Marble burying', 'MRI Habituation', 'Odour task', 'Food Burying', 'Ultrasonic Vocalization'],
  internal: {
    edition: 1,
    name: 'MOUSE_BEHAVIOURAL_FORM'
  },
  content: {
    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['To be filled in whenever the animal is weighed. It is expected to know what type of scale is used (portable vs. non-portable) as well as its serial code. It is also assumed that proper weighing protocol is followed']
  },
  details: {
    description: 'A form to track data from whenever an animal is weighed.',
    license: 'Apache-2.0',
    title: 'Mouse Behavioral Experiment Form'
  },
  measures: {
   
    additionalComments: {
      kind: 'const',
      visibility: 'visible',
      ref: 'additionalComments'
    }

  },
  validationSchema: z.object({
    additionalComments: z.string().optional()
  })
});
