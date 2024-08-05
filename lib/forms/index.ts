/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Injections', 'Drug', 'Physical Intervention','Anesthesia'],
  internal: {
    edition: 1,
    name: 'MOUSE_INJECTIONS_FORM'
  },
  content: {},
  details: {
    description: 'A form to describe a mouses injection information',
    estimatedDuration: 1,
    instructions: ['Please fill out this form whenever a mouse experiences an injection'],
    license: 'UNLICENSED',
    title: 'Injections Form'
  },
  measures: {},
  validationSchema: z.object({})
});
