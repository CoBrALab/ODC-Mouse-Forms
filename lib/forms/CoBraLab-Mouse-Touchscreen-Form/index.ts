/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['<PLACEHOLDER>'],
  internal: {
    edition: 1,
    name: 'MOUSE_TOUCHSCREEN_FORM'
  },
  content: {},
  details: {
    description: 'form to collect data from a mouses touchscreen session',
    estimatedDuration: 1,
    instructions: ['Please answer the forms questions as accurately as possible, this form is meant be filled in per mouse used'],
    license: 'UNLICENSED',
    title: 'Mouse Touchscreen form'
  },
  measures: {},
  validationSchema: z.object({})
});
