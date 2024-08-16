/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

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
      kind: 'string',
      variant: 'input',
      label: 'Weight of mouse (in grams)'
    },
    scaleID: {
      kind: 'string',
      variant: 'input',
      label: "Scale ID"
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
    instructions: ['To be filled in whenver the animal is weighed. It is expected to know what type of scale is used (portable vs. non-portable). It is also assumed that proper weighing protocol is followed'],
    license: 'UNLICENSED',
    title: 'Mouse Weight Form'
  },
  measures: {
    mouseWeight: {
      kind: 'const',
      label: 'Mouse weight',
      ref: 'mouseWeight'
    },
    scaleID: {
      kind: 'const',
      label: "Scale Identification",
      ref: "scaleID"
    },
    scaleKind: {
      kind: "const",
      ref: "scaleKind"
    }

  },
  validationSchema: z.object({
    mouseWeight: z.string().transform<string | number>((val, ctx) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Not a number'
        });
        

        // This is a special symbol you can use to
        // return early from the transform function.
        // It has type `never` so it does not affect the
        // inferred return type.
        return z.NEVER;
      }
      if(parsed < 0 || parsed > 45.0){
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Weight has to be in range for 0 to 45 grams'
        })
        return z.NEVER;
      }

      return parsed
    }),
    scaleID: z.string(),
    scaleKind: z.string()
  })
});
