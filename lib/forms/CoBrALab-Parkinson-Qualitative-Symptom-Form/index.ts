/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Parkinson', 'Symptoms', 'Qualitative score'],
  internal: {
    edition: 1,
    name: 'PARKINSON_QUALITATIVE_SYMPTOM_FORM'
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['To be filled in each time a mouse is examined for Parkinson-like motor symptoms, for example at an MRI scan or at a motor task.']
  },
  content: {
    score: {
      kind: 'number',
      variant: 'radio',
      label: 'Qualitative symptom score',
      options: {
        0: 'No symptoms',
        1: 'Symptomatic',
        2: 'Symptomatic, humane endpoint reached'
      }
    },
    comments: {
      kind: 'string',
      variant: 'textarea',
      label: 'Comments'
    }
  },
  details: {
    description: 'A form to track the qualitative score of Parkinson-like symptoms seen in a mouse.',
    license: 'Apache-2.0',
    title: 'Parkinson Qualitative Symptom Form'
  },
  measures: {
    score: {
      kind: 'const',
      label: 'Qualitative symptom score',
      visibility: 'visible',
      ref: 'score'
    },
    comments: {
      kind: 'const',
      label: 'Comments',
      visibility: 'visible',
      ref: 'comments'
    }
  },
  validationSchema: z.object({
    score: z.number().int().min(0).max(2),
    comments: z.string().optional()
  })
});
