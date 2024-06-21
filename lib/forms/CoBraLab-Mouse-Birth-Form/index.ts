/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Birth', 'Mouse'],
  internal: {
    edition: 1,
    name: 'MOUSE_BIRTH_FORM'
  },
  content: {
    dateOfBirth: {
      kind: 'date',
      label: "date of birth"
    },
    motherMouse: {
      kind: "string",
      variant: "input",
      label: "Id of mouse's mother"
    },
  },
  details: {
    description: 'Form used to track a mouses birth information',
    estimatedDuration: 1,
    instructions: ['Please fill out this form for each new mouse within the lab'],
    license: 'UNLICENSED',
    title: 'Mouse Birth Form'
  },
  measures: {},
  validationSchema: z.object({
    dateOfBirth: z.date(),
    motherMouse: z.string()})
});