/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'Dam', 'Pregnancy', 'Plug'],
  internal: {
    edition: 1,
    name: 'PREGNANCY_PLUG_CHECK_FORM'
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
    instructions: ["To be filled whenever the animal is checked for a pregnany plug, please keep in mind the days since the mouse's last mating session and the ID of the mating partner."]
  },
  details: {
    description: 'A form to track data from whenever an animal is checked for a pregnancy.',
    license: 'Apache-2.0',
    title: 'Pregnancy Plug Check Form'
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
