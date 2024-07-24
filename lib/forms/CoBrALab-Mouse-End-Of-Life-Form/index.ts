/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

function createDependentField<T>(field: T, fn: (bodyExtractionDone: boolean) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['bodyExtractionDone'] as const,
    render: (data: { bodyExtractionDone: boolean }) => {
      if (fn(data.bodyExtractionDone)) {
        return field;
      }
      return null;
    }
  };
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['End of Life', 'Mouse', 'Euthanasia', 'Termination'],
  internal: {
    edition: 1,
    name: 'MOUSE_END_OF_LIFE_FORM'
  },
  content: {
    terminationReason: {
      kind: 'string',
      variant: 'select',
      label: 'Reason for termination',
      options: {
        'End of Experiment': 'End of Experiment',
        'Humane endpoint': 'Humane Endpoint',
        'Veterinary Endpoint': 'Veterinary Endpoint',
        "Surplus": 'Surplus',
        'Surgical complications': 'Surgical complications'
      }
    },
    terminationComments: {
      kind: 'dynamic',
      deps: ['terminationReason'],
      render(data) {
        if (data.terminationReason === 'Humane endpoint' || data.terminationReason === 'Surplus') {
          return {
            kind: 'string',
            variant: 'textarea',
            label: 'Comments'
          };
        }
        return null;
      }
    },
    terminationType: {
      kind: 'string',
      variant: 'select',
      label: 'Form of termination',
      options: {
        'Gas induction': 'Gas induction',
        "Perfusion": 'Perfusion',
        "Guillotine": 'Guillotine',
        'Cardiac puncture': 'Cardiac puncture',
        'Cervical dislocation': 'Cervical dislocation'
      }
    },
    anesthesiaUsed: {
      kind: "boolean",
      variant: "radio",
      label: "Anesthesia used"
    },
    bodyExtractionDone: {
      kind: 'boolean',
      variant: 'radio',
      label: 'Body part extracted'
    },
    bodyExtractionInfo: {
      kind: 'dynamic',
      deps: ["bodyExtractionDone"],
      render(data) {
        if(data.bodyExtractionDone){
          return {
              kind: 'record-array',
              label: 'Body part extraction info',
              fieldset: {
                bodyPartExtracted: {
                  kind: 'string',
                  variant: 'select',
                  label: 'Body part extracted',
                  options: {
                    'Brain': 'Brain',
                    "Gut": 'Gut',
                    'Fat tissue': 'Fat tissue',
                    "Heart": 'Heart',
                    "Liver": "Liver"
                  }
                },
                bodyExtractionReason: {
                  kind: 'string',
                  variant: 'textarea',
                  label: 'Reason for Extraction'
                },
                bodyPartStorageSolution: {
                  kind: 'string',
                  variant: 'select',
                  label: 'Storage solution',
                  options: {
                    'Ethanol': 'Ethanol 70%',
                    'Sodium Alzide': 'Sodium Alzide',
                    'Gadolum Bath': 'Gadolum Bath',
                    "None": "None"
                  }
                },
                bodyPartStorageLocation: {
                  kind: 'string',
                  variant: 'select',
                  label: 'Storage Location',
                  options: {
                    'Fridge': 'Fridge',
                    'Freezer': 'Freezer',
                    'Room temperature': 'Room temperature'
                  }
                },
                storageFridgeId: {
                  kind: 'dynamic',
                  render(data) {
                    if (data.bodyPartStorageLocation === 'Fridge') {
                      return {
                        kind: 'string',
                        variant: 'input',
                        label: 'Fridge ID'
                      };
                    }
                    return null;
                  }
                }
              }
          }
        }
        return null
      }
    
    }
  },
  details: {
    description: 'Form to fill in info of mouse end of life',
    estimatedDuration: 1,
    instructions: ['Please fill in this for when a mouse reaches the end of its life'],
    license: 'UNLICENSED',
    title: 'Mouse End Of Life Form'
  },
  measures: {},
  validationSchema: z.object({
    terminationReason: z.string(),
    terminationComments: z.string().optional(),
    terminationType: z.string(),
    anesthesiaUsed: z.boolean(),
    bodyExtractionDone: z.boolean(),
    bodyExtractionInfo: z
      .array(
        z.object({
          bodyPartExtracted: z.string(),
          bodyExtractionReason: z.string(),
          bodyPartStorageSolution: z.string(),
          bodyPartStorageLocation: z.string(),
          storageFridgeId: z.string().optional()
        })
      )
      .optional()
  })
});
