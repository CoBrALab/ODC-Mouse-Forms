/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'MRI Habituation', 'Sound', 'Preyer reflex'],
  internal: {
    edition: 1,
    name: 'MRI_HABITUATION_FORM'
  },
  defaultMeasureVisibility: 'visible',
  content: {
    roomNumber: {
        kind: "string",
        variant: "input",
        label: "Room number"
    },
    
    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['To be filled in whenever and animal completes a MRI habituation session. On must track information on the location of the session, tracking dropping done by the animal, and room position']
  },
  details: {
    description: 'A form to track data from whenever an animal goes through an MRI Habituation session',
    license: 'Apache-2.0',
    title: 'MRI Habituation Form'
  },
  measures: {
    roomNumber: {
        kind: 'const',
        ref: "roomNumber"
    },
    additionalComments: {
      kind: 'const',
      ref: 'additionalComments'
    }

  },
  validationSchema: z.object({
    roomNumber: z.string(),
    additionalComments: z.string().optional()
  })
});
