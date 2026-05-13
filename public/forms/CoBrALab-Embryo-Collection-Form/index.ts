/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'Embryo', 'Collection', 'Genetics', 'SRY'],
  internal: {
    edition: 1,
    name: 'EMBRYO_COLLECTION_FORM'
  },
  content: [
    {
      title: 'Collection Details',
      fields: {
        damId: {
          kind: 'string',
          variant: 'input',
          label: 'Dam ID'
        },
        sireId: {
          kind: 'string',
          variant: 'input',
          label: 'Sire ID'
        },
        gestationalDay: {
          kind: 'number',
          variant: 'input',
          label: 'Gestational Day'
        },
        numberOfEmbryos: {
          kind: 'number',
          variant: 'input',
          label: 'Number of Embryos'
        }
      }
    },
    {
      title: 'Embryo Data',
      description: 'Add one entry per embryo collected. The total number of entries must match the number of embryos entered above.',
      fields: {
        embryos: {
          kind: 'record-array',
          label: 'Embryos',
          fieldset: {
            embryoId: {
              kind: 'string',
              variant: 'input',
              label: 'Embryo ID'
            },
            yolkSacCollected: {
              kind: 'boolean',
              variant: 'radio',
              label: 'Yolk sac collected for SRY?'
            },
            uterineHorn: {
              kind: 'string',
              variant: 'radio',
              label: 'Uterine Horn',
              options: {
                Left: 'Left',
                Right: 'Right'
              }
            },
            positionInUterineHorn: {
              kind: 'number',
              variant: 'input',
              label: 'Position in Uterine Horn'
            },
            weightGrams: {
              kind: 'number',
              variant: 'input',
              label: 'Weight (g)'
            }
          }
        }
      }
    }
  ],
  clientDetails: {
    estimatedDuration: 5,
    instructions: [
      'Fill out the Collection Details section first.',
      'Then add one row per embryo in the Embryo Data table using the add button.',
      'The number of embryo rows must equal the number entered in "Number of Embryos".'
    ]
  },
  details: {
    description: 'A form to record data collected during embryo collection, including per-embryo identifiers, yolk sac collection status for SRY genotyping, uterine horn position, and weight.',
    license: 'Apache-2.0',
    title: 'Embryo Collection Form'
  },
  measures: {
    damId: {
      kind: 'const',
      visibility: 'visible',
      ref: 'damId'
    },
    sireId: {
      kind: 'const',
      visibility: 'visible',
      ref: 'sireId'
    },
    gestationalDay: {
      kind: 'const',
      visibility: 'visible',
      ref: 'gestationalDay'
    },
    numberOfEmbryos: {
      kind: 'const',
      visibility: 'visible',
      ref: 'numberOfEmbryos'
    },
    embryos: {
      kind: 'computed',
      label: 'Embryo Data',
      visibility: 'visible',
      value: (data) => {
        return (data.embryos ?? []).map((e) => ({
          'Embryo ID': e.embryoId,
          'Yolk Sac Collected for SRY': e.yolkSacCollected ? 'Yes' : 'No',
          'Uterine Horn': e.uterineHorn ?? 'N/A',
          'Position in Uterine Horn': e.positionInUterineHorn ?? 'N/A',
          'Weight (g)': e.weightGrams ?? 'N/A'
        }));
      }
    }
  },
  validationSchema: z
    .object({
      damId: z.string().min(1, 'Dam ID is required'),
      sireId: z.string().optional(),
      gestationalDay: z.number().min(0, 'Gestational day must be 0 or greater'),
      numberOfEmbryos: z.number().int().min(1, 'Number of embryos must be at least 1'),
      embryos: z.array(
        z.object({
          embryoId: z.string().min(1, 'Embryo ID is required'),
          yolkSacCollected: z.boolean(),
          uterineHorn: z.enum(['Left', 'Right']).optional(),
          positionInUterineHorn: z.number().int().min(1).optional(),
          weightGrams: z.number().min(0).optional()
        })
      )
    })
    .superRefine((data, ctx) => {
      if (data.embryos.length !== data.numberOfEmbryos) {
        ctx.addIssue({
          code: 'custom',
          path: ['embryos'],
          message: `Number of embryo entries (${data.embryos.length}) must match the stated number of embryos (${data.numberOfEmbryos}).`
        });
      }
    })
});
