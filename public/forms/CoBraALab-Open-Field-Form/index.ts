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
    arenaPlacement: {
      kind: 'string',
      variant: 'radio',
      label: 'Arena placement',
      options: {
        "Floor": "Floor",
        "Platform": "Platform",
        "Table": "Table",
        "Other": "Other"
      }
    },
    arenaPlacementOther: {
      kind: 'dynamic',
      deps: ['arenaPlacement'],
      render(data) {
        if (data.arenaPlacement === 'Other') {
          return {
            kind: 'string',
            variant: 'input',
            label: 'Other arena placement'
          }
        }
        return null
      }
    },
    arenaNumber: {
      kind: 'string',
      variant: 'input',
      label: 'Arena number'
    },
    mouseEntryCorner: {
      kind: 'string',
      variant: 'radio',
      label: 'Mouse entry corner',
      description: 'As defined in the project setup documentation',
      options: {
        "Top left": "Top left",
        "Top right": "Top right",
        "Bottom left": "Bottom left",
        "Bottom right": "Bottom right"
      }
    },
    visualCuesUsed: {
      kind: 'boolean',
      variant: 'radio',
      label: 'Were visual cues used? (optional)'
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
    testTime: {
      kind: 'string',
      variant: 'input',
      label: 'Test time (HH:MM, 24-hour)',
      description: 'The exact time the mouse was placed inside the arena'
    },
    videoName: {
      kind: 'string',
      variant: 'input',
      label: 'Video name'
    },
    additionalComments: {
      kind: 'string',
      variant: 'textarea',
      label: 'Additional Comments'
    }
  },
  clientDetails: {
    estimatedDuration: 2,
    instructions: ['To be filled in whenever a mouse completes an open field test. Arena placement, entry corner and visual cues should follow the project specific setup documentation.']
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
    arenaPlacement: {
      kind: 'const',
      visibility: 'visible',
      ref: 'arenaPlacement'
    },
    arenaPlacementOther: {
      kind: 'const',
      visibility: 'visible',
      ref: 'arenaPlacementOther'
    },
    arenaNumber: {
      kind: 'const',
      visibility: 'visible',
      ref: 'arenaNumber'
    },
    mouseEntryCorner: {
      kind: 'const',
      visibility: 'visible',
      ref: 'mouseEntryCorner'
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
    testTime: {
      kind: 'const',
      visibility: 'visible',
      ref: 'testTime'
    },
    videoName: {
      kind: 'const',
      visibility: 'visible',
      ref: 'videoName'
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
    arenaPlacement: z.enum(["Floor", "Platform", "Table", "Other"]),
    arenaPlacementOther: z.string().optional(),
    arenaNumber: z.string(),
    mouseEntryCorner: z.enum(["Top left", "Top right", "Bottom left", "Bottom right"]),
    visualCuesUsed: z.boolean().optional(),
    visualCuesType: z.set(z.enum(["External", "Internal"])).optional(),
    testTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Please enter a 24-hour time in the format HH:MM (e.g. 14:35)"),
    videoName: z.string(),
    additionalComments: z.string().optional()
  }).superRefine((data, ctx) => {
    if (data.arenaPlacement === "Other" && !data.arenaPlacementOther) {
      ctx.addIssue({
        code: "custom",
        path: ["arenaPlacementOther"],
        message: "This field is required when the arena placement is Other."
      });
    }
    if (data.visualCuesUsed && (!data.visualCuesType || data.visualCuesType.size === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["visualCuesType"],
        message: "This field is required when visual cues were used."
      });
    }
  })
});
