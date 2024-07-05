/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['End of Life', 'Mouse', 'Euthanasia','Termination'],
  internal: {
    edition: 1,
    name: 'MOUSE_END_OF_LIFE_FORM'
  },
  content: {},
  details: {
    description: '<PLACEHOLDER>',
    estimatedDuration: 1,
    instructions: ['<PLACEHOLDER>'],
    license: 'UNLICENSED',
    title: 'Mouse End Of Life Form'
  },
  measures: {},
  validationSchema: z.object({})
});