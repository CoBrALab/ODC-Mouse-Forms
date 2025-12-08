/* eslint-disable perfectionist/sort-objects */

import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core'
import { z } from '/runtime/v1/zod@3.23.x'

type TerminationType =  'Gas induction' | "Perfusion" | "Guillotine" | 'Cardiac puncture' | 'Cervical dislocation' | 'Gas induction + Cervical dislocation'

function createDependentField<const T>(field: T, fn: (terminationType?: TerminationType) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['terminationType'] as const,
    render: (data: { terminationType?: TerminationType }) => {
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
    edition: 4,
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
      kind: 'dynamic',
      deps: ['terminationReason'],
      render(data) {
        if(data.terminationReason === "Surgical complications" || data.terminationReason === undefined){
          return null
        }
        return {
          kind: 'string',
          variant: 'select',
          label: 'Form of termination',
          options: {
            'Gas induction': 'Gas induction',
            "Perfusion": 'Perfusion',
            "Guillotine": 'Guillotine',
            'Cardiac puncture': 'Cardiac puncture',
            'Cervical dislocation': 'Cervical dislocation',
            'Gas induction + Cervical dislocation': 'Gas induction + Cervical dislocation'
          }
        }
      }
    },
    surgeryDeathCause: {
      kind: 'dynamic',
      deps: ["terminationReason"],
      render(data) {
        if(data.terminationReason === 'Surgical complications'){
          return {
            kind: "string",
            variant: "select",
            label: "Cause of surgical complication death",
            options: {
              "Irregular breathing": "Irregular breathing",
              "Excessive blood loss": "Excessive blood loss",
              "Blood hemorrhage": "Blood hemorrhage",
              "Paralysis": "Paralysis",
              "Other": "Other"
            }
          }
        }
      return null
      }
    },
    bloodCollected: createDependentField({
      kind: 'number',
      variant: "input",
      label: "Blood collected (ml)"
    },
      (type) => type === 'Cardiac puncture'
    ),
    
    perfusionAnestheticType: createDependentField({
      kind: "string",
      variant: "select",
      label: "Type of anesthetic used for perfusion",
      options: {
        "Ip Injection":"Ip Injection (Ketamine)",
        "Gas": "Gas (Isoflurane)"
      }
    }, (type) => type === "Perfusion" ),
    ipAnestheticDose: {
      kind: 'dynamic',
      deps: ["perfusionAnestheticType"],
      render(data){
        if(data.perfusionAnestheticType === 'Ip Injection'){
          return {
            kind: 'number',
            variant: "input",
            label: 'Injection dose (ml)'
          }
        }
        return null
      }
    },

    perfusionFlushingSolution: createDependentField({
            kind: "string",
            variant: "radio",
            label: "Perfusion flushing solution",
            options: {
              "PBS+Heparin":"PBS and Heparin",
              "4% Isoflurane": "4% Isoflurane"
            }
    }, (type) => type === 'Perfusion'),
   
    anesthesiaUsed: {
      kind: 'dynamic',
      deps: ['terminationReason'],
      render(data){
        if(data.terminationReason !== 'Veterinary Endpoint' && data.terminationReason !== undefined){
          return {
            kind: 'boolean',
            variant: 'radio',
            label: 'Anesthesia used'
          }
        }
        return null
      }
    },
    gasUsed: createDependentField({
            kind: "string",
            variant: "select",
            label: "Gas used for induction",
            options: {
              "CO2": "CO2",
              "Other": "Other"
            }
    }, (type) => type === 'Gas induction' || type === 'Gas induction + Cervical dislocation'),
    otherGasUsed: {
      kind: "dynamic",
      deps: ["gasUsed"],
      render(data){
        if(data.gasUsed === 'Other'){
          return {
            kind: "string",
            variant: "input",
            label: "Other gas used"
          }
        }
        return null
      }
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
                deps: ['bodyPartExtracted'],
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
                  'Gadolinium Bath': 'Gadolinium Bath',
                  "None": 'None'
                }
              },
              bodyPartStorageLocation: {
                kind: 'string',
                variant: 'select',
                label: 'Storage Location',
                options: {
                  "Fridge": 'Fridge',
                  "-20° Freezer": '-20° Freezer',
                  "-80° Freezer":"-80° Freezer",
                  'Room temperature': 'Room temperature'
                }
              },
            }
          };
        }
        return null;
      }
    },
    additionalComments: {
      kind: 'string',
      variant: 'textarea',
      label: 'Additional comments'
    }
    
  },
  details: {
    description: 'Form to fill in info of mouse end of life',
    license: 'Apache-2.0',
    title: 'Mouse End Of Life Form'
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['Please fill in this for when a mouse reaches the end of its life']
  },
  measures: {
     terminationReason: {
      kind: "const",
      label: "Reason for termination",
      visibility: "visible",
      ref: "terminationReason"
    },
    terminationComments: {
      kind: "const",
      label: "Comments",
      visibility: "visible",
      ref: "terminationComments"
    },
    terminationType: {
      kind: "const",
      label: "Form of termination",
      visibility: "visible",
      ref: "terminationType"
    },
    surgeryDeathCause: {
      kind: "const",
      label: "Surgery complications death cause",
      visibility: "visible",
      ref: "surgeryDeathCause"
    },
    bloodCollected: {
      kind: "const",
      label: "Blood collected (ml)",
      visibility: "visible",
      ref: "bloodCollected"
    },
    perfusionAnestheticType: {
      kind: "const",
      label: "Type of perfusion",
      visibility: "visible",
      ref: "perfusionAnestheticType"
    },
    ipAnestheticDose: {
      kind: "const",
      label: "Injection dose (ml)",
      visibility: "visible",
      ref: "ipAnestheticDose"
    },
    perfusionFlushingSolution: {
      kind: "const",
      label: "Perfusion flushing solution",
      visibility: "visible",
      ref: "perfusionFlushingSolution"
    },
    anesthesiaUsed: {
      kind: "const",
      label: "Anesthesia used",
      visibility: "visible",
      ref: "anesthesiaUsed"
    },
    gasUsed: {
      kind: "const",
      label: "Gas used",
      visibility: "visible",
      ref: "gasUsed"
    },
    otherGasUsed: {
      kind: "const",
      label: "Other gas used",
      visibility: "visible",
      ref: "otherGasUsed"
    },
    bodyExtractionDone: {
      kind: "const",
      label: "Body part extracted",
      visibility: "visible",
      ref: "bodyExtractionDone"
    },
    bodyExtractionInfo: {
      kind: "computed",
      label: "Body part extraction info",
      visibility: "visible",
      value: (data) => {
        const bodyExtractionValues = data.bodyExtractionInfo || []
        const bodyExtractionResults = bodyExtractionValues.map(info => ({
          "Body part extracted": info.bodyPartExtracted,
          "Extraction motive": info.extractionMotive,
          "Extraction reason comments": info.bodyExtractionComments,
          "PFA batch": info.pfaBatch,
          "PFA batch expiration": info.pfaBatchExpiration,
          "Body part storage solution": info.bodyPartStorageSolution,
          "Body part storage location": info.bodyPartStorageLocation,
        }))
        return bodyExtractionResults
      }
    },
    additionalComments: {
      kind: "const",
      label: "Additional comments",
      visibility: "visible",
      ref: "additionalComments"
    }

  },
  validationSchema: z.object({
    terminationReason: z.enum(['End of Experiment',
      'Humane endpoint',
      'Veterinary Endpoint',
      "Surplus",
      'Surgical complications']),
    terminationComments: z.string().optional(),
    terminationType: z.enum([
    'Gas induction',
    'Perfusion',
    'Guillotine',
    'Cardiac puncture',
    'Cervical dislocation',
    'Gas induction + Cervical dislocation'
  ]).optional(),
    surgeryDeathCause: z.enum([
    'Irregular breathing',
    'Excessive blood loss',
    'Blood hemorrhage',
    'Paralysis',
    'Other'
  ]).optional(),
    bloodCollected: z.number().optional(),
    perfusionAnestheticType: z.enum([
    'Ip Injection',
    'Gas'
  ]).optional(),
    ipAnestheticDose: z.number().optional(),
    perfusionFlushingSolution:  z.enum([
    'PBS+Heparin',
    '4% Isoflurane'
  ]).optional(),
    anesthesiaUsed: z.boolean().optional(),
    gasUsed: z.enum(["CO2","Other"]).optional(),
    otherGasUsed: z.string().optional(),
    bodyExtractionDone: z.boolean(),
    bodyExtractionInfo: z
      .array(
        z.object({
          bodyPartExtracted: z.enum([
          'Brain',
          'Gut',
          'Fat tissue',
          'Heart',
          'Liver',
          'Tail',
          'Blood extraction'
        ]),
          bodyExtractionComments: z.string(),
          extractionMotive: z.string().optional(),
          pfaBatch: z.string().optional(),
          pfaBatchExpiration: z.date().optional(),
          bodyPartStorageSolution: z.enum([
          'Ethanol',
          'Sodium Alzide',
          'Gadolinium Bath',
          'None'
        ]),
          bodyPartStorageLocation: z.enum([
          'Fridge',
          '-20° Freezer',
          '-80° Freezer',
          'Room temperature'
        ])
        })
      )
      .optional(),
    
    additionalComments: z.string().optional()
  })
});
