/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Behaviour', 'Open Field', 'Video'],
  internal: {
    edition: 1,
    name: 'MOUSE_OPEN_FIELD_TEST_FORM'
  },
  content: {
    roomNumber: {
      kind: 'string',
      variant: 'input',
      label: 'Room number'
    },
    lightCondition: {
      kind: 'string',
      variant: 'radio',
      label: 'Light',
      options: {
        "Red light": "Red light",
        "Lights on": "Lights on",
        "Lights off": "Lights off"
      }
    },
    habituationTime: {
      kind: 'number',
      variant: 'input',
      label: 'Time of habituation to the room (minutes)'
    },
    arenaNumber: {
      kind: 'number',
      variant: 'select',
      label: 'Arena number',
      options: {
        1: '1',
        2: '2',
        3: '3',
        4: '4'
      }
    },
    mouseEntryPlacement: {
      kind: 'string',
      variant: 'radio',
      label: 'Mouse entry placement',
      description: 'As defined in the project standard operating procedure',
      options: {
        "Top left": "Top left",
        "Top right": "Top right",
        "Bottom left": "Bottom left",
        "Bottom right": "Bottom right",
        "Center": "Center"
      }
    },
    visualCuesUsed: {
      kind: 'boolean',
      variant: 'radio',
      label: 'Were visual cues used? (optional)',
      options: {
        true: 'Yes',
        false: 'No'
      }
    },
    visualCuesType: {
      kind: 'dynamic',
      deps: ['visualCuesUsed'],
      render(data) {
        if (data.visualCuesUsed) {
          return {
            kind: 'set',
            variant: 'listbox',
            label: 'Visual cue placement',
            options: {
              "External": "External (outside the arena)",
              "Internal": "Internal (inside the arena)"
            }
          }
        }
        return null
      }
    },
    additionalComments: {
      kind: 'string',
      variant: 'textarea',
      label: 'Additional Comments'
    }
  },
  clientDetails: {
    estimatedDuration: 2,
    instructions: ['To be filled in whenever a mouse completes an open field test. Entry corner and visual cues should follow the project specific standard operating procedure.']
  },
  details: {
    description: 'A form to track the setup and recording of an open field test given to a mouse',
    license: 'Apache-2.0',
    title: 'Mouse Open Field Test Form'
  },
  measures: {
    roomNumber: {
      kind: 'const',
      visibility: 'visible',
      ref: 'roomNumber'
    },
    lightCondition: {
      kind: 'const',
      visibility: 'visible',
      ref: 'lightCondition'
    },
    habituationTime: {
      kind: 'const',
      visibility: 'visible',
      ref: 'habituationTime'
    },
    arenaNumber: {
      kind: 'const',
      visibility: 'visible',
      ref: 'arenaNumber'
    },
    mouseEntryPlacement: {
      kind: 'const',
      visibility: 'visible',
      ref: 'mouseEntryPlacement'
    },
    visualCuesUsed: {
      kind: 'const',
      visibility: 'visible',
      ref: 'visualCuesUsed'
    },
    visualCuesType: {
      kind: 'const',
      visibility: 'visible',
      ref: 'visualCuesType'
    },
    additionalComments: {
      kind: 'const',
      visibility: 'visible',
      ref: 'additionalComments'
    }
  },
  validationSchema: z.object({
    roomNumber: z.string(),
    lightCondition: z.enum(["Red light", "Lights on", "Lights off"]),
    habituationTime: z.number().int().min(0),
    arenaNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    mouseEntryPlacement: z.enum(["Top left", "Top right", "Bottom left", "Bottom right", "Center"]),
    visualCuesUsed: z.boolean().optional(),
    visualCuesType: z.set(z.enum(["External", "Internal"])).optional(),
    additionalComments: z.string().optional()
  }).superRefine((data, ctx) => {
    if (data.visualCuesUsed && (!data.visualCuesType || data.visualCuesType.size === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["visualCuesType"],
        message: "This field is required when visual cues were used."
      });
    }
  })
});
