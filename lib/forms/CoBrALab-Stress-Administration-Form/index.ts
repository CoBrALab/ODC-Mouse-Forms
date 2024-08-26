/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['<PLACEHOLDER>'],
  internal: {
    edition: 1,
    name: 'STRESS_ADMINISTRATION_FORM'
  },
  content: {},
  details: {
    description: '<PLACEHOLDER>',
    estimatedDuration: 1,
    instructions: ['<PLACEHOLDER>'],
    license: 'UNLICENSED',
    title: 'Stress Administration Form'
  },
  measures: {},
  validationSchema: z.object({})
});
