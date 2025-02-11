/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'Weight', 'Scale'],
  internal: {
    edition: 2,
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
      variant: 'select',
      label: "Scale serial code",
      options: {
        "8334378068":"8334378068",
        "Other": "Other"
      }
    },
    scaleSerialCodeOther: {
      kind: "dynamic",
      deps: ["scaleSerialCode"],
      render(data) {
        if(data.scaleSerialCode === "Other"){
          return {
            kind: "string",
            variant: "input",
            label: "Please enter other serial code"
          }
        }
        return null
      }
      
    },
    scaleKind: {
      kind: 'string',
      variant: 'select',
      label: "Kind of scale",
      options: {
        "Portable": "Small portable",
        "Regular": "Regular (Scout Pro SP401)"
      }
    },
    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['To be filled in whenever the animal is weighed. It is expected to know what type of scale is used (portable vs. non-portable) as well as its serial code. It is also assumed that proper weighing protocol is followed']
  },
  details: {
    description: 'A form to track data from whenever an animal is weighed.',
    license: 'Apache-2.0',
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
    scaleSerialCodeOther: {
      kind: 'const',
      label: "Other Scale serial code provided",
      ref: "scaleSerialCode"
    },
    scaleKind: {
      kind: "const",
      ref: "scaleKind"
    },
    additionalComments: {
      kind: 'const',
      ref: 'additionalComments'
    }

  },
  validationSchema: z.object({
    mouseWeight: z.number().min(1).max(100),
    scaleSerialCode: z.enum(["8334378068","Other"]),
    scaleSerialCodeOther: z.string().optional(),
    scaleKind: z.enum(["Portable","Regular"]),
    additionalComments: z.string().optional()
  })
});
