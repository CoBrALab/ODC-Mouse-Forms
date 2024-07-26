/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

function createDependentField<T>(field: T, fn: (terminationType: string) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['terminationType'] as const,
    render: (data: { terminationType: string }) => {
      if (fn(data.terminationType)) {
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
    perfusionType: createDependentField({
      kind: "string",
      variant: "select",
      label: "Type of perfusion",
      options: {
        "Ip Injection":"Ip Injection",
        "Gas": "Gas"
      }
    }, (type) => type === "Perfusion" ),
    perfusionDose: createDependentField({
      kind: "dynamic",
      render(data) {
        if(data.perfusionType === "Ip Injection"){
          return {
            kind: "string",
            variant: "input",
            label: "Injection dose"
          }
        }
        return null
      }
    },
      (type) => type === 'Perfusion'
    ),
    anesthesiaUsed: {
      kind: 'boolean',
      variant: 'radio',
      label: 'Anesthesia used'
    },
    bodyExtractionDone: {
      kind: 'boolean',
      variant: 'radio',
      label: 'Body part extracted'
    },
    bodyExtractionInfo: {
      kind: 'dynamic',
      deps: ['bodyExtractionDone'],
      render(data) {
        if (data.bodyExtractionDone) {
          return {
            kind: 'record-array',
            label: 'Body part extraction info',
            fieldset: {
              bodyPartExtracted: {
                kind: 'string',
                variant: 'select',
                label: 'Body part extracted',
                options: {
                  "Brain": 'Brain',
                  "Gut": 'Gut',
                  'Fat tissue': 'Fat tissue',
                  "Heart": 'Heart',
                  "Liver": 'Liver',
                  'Blood extraction': 'Blood extraction'
                }
              },
              extractionMotive: {
                kind: 'dynamic',
                render(data) {
                  if (data.bodyPartExtracted === 'Brain') {
                    return {
                      kind: 'string',
                      variant: 'select',
                      label: 'Brain extraction motive',
                      options: {
                        "ELISA": 'ELISA',
                        "Immunohistochemistry": 'Immunohistochemistry',
                        'RNA sequencing': 'RNA sequencing',
                        "Other": 'Other'
                      }
                    };
                  } else if (data.bodyPartExtracted === 'Blood extraction') {
                    return {
                      kind: 'string',
                      variant: 'select',
                      label: 'Blood extraction type',
                      options: {
                        "Plasma": 'Plasma',
                        "Serum": 'Serum'
                      }
                    };
                  }
                  return null;
                }
              },
              bodyExtractionComments: {
                kind: 'string',
                variant: 'textarea',
                label: 'Comments for extraction reason'
              },
              bodyPartStorageSolution: {
                kind: 'string',
                variant: 'select',
                label: 'Storage solution',
                options: {
                  "Ethanol": 'Ethanol 70%',
                  'Sodium Alzide': 'Sodium Alzide',
                  'Gadolum Bath': 'Gadolum Bath',
                  "None": 'None'
                }
              },
              bodyPartStorageLocation: {
                kind: 'string',
                variant: 'select',
                label: 'Storage Location',
                options: {
                  "Fridge": 'Fridge',
                  "Freezer": 'Freezer',
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
              },
            }
          };
        }
        return null;
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
    perfusionType: z.string().optional(),
    perfusionDose: z.string().optional(),
    anesthesiaUsed: z.boolean(),
    bodyExtractionDone: z.boolean(),
    bodyExtractionInfo: z
      .array(
        z.object({
          bodyPartExtracted: z.string(),
          bodyExtractionComments: z.string(),
          extractionMotive: z.string(),
          bodyPartStorageSolution: z.string(),
          bodyPartStorageLocation: z.string(),
          storageFridgeId: z.string().optional()
        })
      )
      .optional()
  })
});
