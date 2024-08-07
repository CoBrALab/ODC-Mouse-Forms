/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Surgery', 'Vet Care', 'Wound Treatment', 'Ovariectomy'],
  internal: {
    edition: 1,
    name: 'MOUSE_SURGERY_FORM'
  },
  content: {},
  details: {
    description: 'Form to be filled in when a mouse goes through a surgery or veterinary care',
    estimatedDuration: 1,
    instructions: ['Please fill this form whenever a mouse has to through a surgery or has gone through veterinary care'],
    license: 'UNLICENSED',
    title: 'Mouse surgery, wound treatment and veterinary care form'
  },
  measures: {},
  validationSchema: z.object({})
});
