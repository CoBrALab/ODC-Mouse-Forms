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
    scaleIndentification: {
      kind: 'string',
      variant: 'input',
      label: "Scale identification"
    }
  },
  details: {
    description: 'Form to track weight of mouse',
    estimatedDuration: 1,
    instructions: ['Please fill in the form to track the weight of the mouse'],
    license: 'UNLICENSED',
    title: 'Mouse Weight Form'
  },
  measures: {
    mouseWeight: {
      kind: 'const',
      label: 'Mouse weight',
      ref: 'mouseWeight'
    },
    scaleIndentification: {
      kind: 'const',
      label: "Scale Identification",
      ref: "scaleIndentification"
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
    scaleIdentification: z.string()
  })
});
