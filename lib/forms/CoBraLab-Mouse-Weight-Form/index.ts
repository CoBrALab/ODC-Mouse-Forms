/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'Weight', 'Scale'],
  internal: {
    edition: 1,
    name: 'MOUSE_WEIGHT_FORM'
  },
  content: {
    mouseWeight: {
      kind: 'number',
      variant: 'input',
      label: 'Weight of mouse (in grams)'
    },
    scaleSerialCode: {
      kind: 'string',
      variant: 'input',
      label: "Scale serial code"
    },
    scaleKind: {
      kind: 'string',
      variant: 'select',
      label: "Kind of scale",
      options: {
        "Portable": "Small portable",
        "Regular": "Regular"
      }
    }
  },
  details: {
    description: 'A form to track data from whenever an animal is weighed.',
    estimatedDuration: 1,
    instructions: ['To be filled in whenever the animal is weighed. It is expected to know what type of scale is used (portable vs. non-portable) as well as its serial code. It is also assumed that proper weighing protocol is followed'],
    license: 'UNLICENSED',
    title: 'Mouse Weight Form'
  },
  measures: {
    mouseWeight: {
      kind: 'const',
      label: 'Mouse weight',
      ref: 'mouseWeight'
    },
    scaleSerialCode: {
      kind: 'const',
      label: "Scale serial code",
      ref: "scaleSerialCode"
    },
    scaleKind: {
      kind: "const",
      ref: "scaleKind"
    }

  },
  validationSchema: z.object({
    mouseWeight: z.number().min(1).max(50),
    scaleSerialCode: z.string(),
    scaleKind: z.string()
  })
});
