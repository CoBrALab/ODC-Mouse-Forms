/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Rotorod', 'Motor tasks', 'Wire Hang', 'Pole test'],
  internal: {
    edition: 1,
    name: 'MOUSE_MOTOR_TASK_FORM'
  },
  content: {},
  details: {
    description: 'Form to describe data gathered in a mouse\'s motor task experiment',
    estimatedDuration: 1,
    instructions: ["Please fill in this form whenever a mouse completes a motor task"],
    license: 'UNLICENSED',
    title: 'Mouse Motor Task'
  },
  measures: {},
  validationSchema: z.object({})
});
