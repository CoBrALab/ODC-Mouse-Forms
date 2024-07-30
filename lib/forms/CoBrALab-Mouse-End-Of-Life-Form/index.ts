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
    perfusionDose: {
      kind: 'dynamic',
      deps: ["perfusionType"],
      render(data){
        if(data.perfusionType === 'Ip Injection'){
          return {
            kind: 'string',
            variant: "input",
            label: 'Injection dose (ml)'
          }
        }
        return null
      }
    },
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
                  "Tail": "Tail",
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
                        "Immunofluorescence": "Immunofluorescence",
                        "ex-Vivo MRI": "ex-Vivo MRI",
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
              pfaBatch: {
                kind: 'dynamic',
                render(data) {
                  if(data.bodyPartExtracted === 'Brain'){
                    return {
                      kind: 'string',
                      variant: "input",
                      label: "PFA batch"
                    }
                  
                  }
                  return null
                }
              },
              pfaBatchExpiration: {
                kind: 'dynamic',
                render(data) {
                  if(data.bodyPartExtracted === 'Brain'){
                    return {
                      kind: 'date',
                      label: "PFA batch expiration date"
                    }
                  
                  }
                  return null
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
  measures: {
     terminationReason: {
      kind: "const",
      label: "Reason for termination",
      ref: "terminationReason"
    },
    terminationComments: {
      kind: "const",
      label: "Comments",
      ref: "terminationComments"
    },
    terminationType: {
      kind: "const",
      label: "Form of termination",
      ref: "terminationType"
    },
    perfusionType: {
      kind: "const",
      label: "Type of perfusion",
      ref: "perfusionType"
    },
    perfusionDose: {
      kind: "const",
      label: "Injection dose (ml)",
      ref: "perfusionDose"
    },
    anesthesiaUsed: {
      kind: "const",
      label: "Anesthesia used",
      ref: "anesthesiaUsed"
    },
    bodyExtractionDone: {
      kind: "const",
      label: "Body part extracted",
      ref: "bodyExtractionDone"
    },
    bodyExtractionInfo: {
      kind: "computed",
      label: "Body part extraction info",
      value: (data) => {
        const val = data.bodyExtractionInfo?.map((x) => x);
        let extractInfo = '';
        if (val) {
          for (const info of val) {
            extractInfo += info.bodyPartExtracted + ' ' + info.bodyExtractionComments + ' ' + (info.extractionMotive ?? '') + ' ' + (info.pfaBatch ?? '') + ' ' 
            + (info.pfaBatchExpiration ?? '') + ' ' + info.bodyExtractionComments + ' ' + info.bodyPartStorageSolution + ' ' + info.bodyPartStorageLocation + ' ' + 
            info.storageFridgeId + '\n';
          }
        }
        return extractInfo;
      }
    }

  },
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
          extractionMotive: z.string().optional(),
          pfaBatch: z.string().optional(),
          pfaBatchExpiration: z.date().optional(),
          bodyPartStorageSolution: z.string(),
          bodyPartStorageLocation: z.string(),
          storageFridgeId: z.string().optional()
        })
      )
      .optional()
  })
});
