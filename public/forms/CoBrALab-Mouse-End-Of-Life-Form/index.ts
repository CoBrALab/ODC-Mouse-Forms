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
        if(data.terminationReason === "Surgical complications" || data.terminationReason === undefined || data.terminationReason === 'Veterinary Endpoint'){
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
      label: "Blood collected (µL)"
    },
      (type) => type === 'Cardiac puncture'
    ),

    anesthesiaUsed: {
      kind: 'dynamic',
      deps: ['terminationReason', 'terminationType'],
      render(data){
        if(data.terminationReason !== 'Veterinary Endpoint' && data.terminationReason !== undefined && data.terminationType !== 'Perfusion'){
          return {
            kind: 'boolean',
            variant: 'radio',
            label: 'Anesthesia used'
          }
        }
        return null
      }
    },

      anesthesiaType: {
      kind: 'dynamic',
      deps: ['anesthesiaUsed'],
      render(data) {
        if(data.anesthesiaUsed) {
          return {
            kind: "string",
            variant: "select",
            label: 'Anesthesia type',
            options: {
              "Isoflurane": "Isoflurane",
              "Other": "Other"
            }
            
          }
        }
        return null
      }
    },
    otherAnesthesiaType: {
       kind: 'dynamic',
      deps: ['anesthesiaUsed', 'anesthesiaType'],
      render(data) {
        if(data.anesthesiaUsed && data.anesthesiaType === "Other") {
          return {
            kind: "string",
            variant: "input",
            label: "Specify anesthesia type"
          }
        }
        return null
      }
    },
    anesthesiaDose: {
      kind: 'dynamic',
      deps: ['anesthesiaUsed', 'anesthesiaType'],
      render(data) {
        if( data.anesthesiaUsed && data.anesthesiaType === "Other") {
          return {
            kind: "number",
            variant: "input",
            label: "Dose amount (µL)",
          }
        }
        return null
      }
    },
    isofluranePercentage: {
      kind: 'dynamic',
      deps: ['anesthesiaUsed', 'anesthesiaType'],
      render(data) {
        if(data.anesthesiaUsed && data.anesthesiaType  === 'Isoflurane') {
          return {
            kind: "number",
            variant: "input",
            label: "Isoflurane percentage"
          }
        }
        return null
      }

    },

    anesthesiaInductionTime: {
      kind: 'dynamic',
      deps: ['anesthesiaUsed', 'anesthesiaType'],
      render(data) {
        if( data.anesthesiaUsed && data.anesthesiaType  === 'Isoflurane') {
          return {
            kind: "number",
            variant: "input",
            label: "Isoflurane induction time (minutes)"
          }
        }
        return null
      }
    },
    
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
            label: 'Injection dose (µL)'
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
              "Other": "Other"
            }
    }, (type) => type === 'Perfusion'),

    perfusionFlushingSolutionOther: {
      kind: "dynamic",
      deps: ['perfusionFlushingSolution'],
      render(data) {
        if(data.perfusionFlushingSolution === "Other"){
          return {
            kind: "string",
            label: "Specify other flushing solution used",
            variant: "input"
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
              overnightStorageSolution: {
                kind: 'string',
                variant: 'select',
                label: 'Overnight storage solution',
                options: {
                  'Ethanol': 'Ethanol 70%',
                  'Sodium Azide': 'Sodium Azide',
                  'Gadolinium Bath': 'Gadolinium Bath',
                  'PFA': 'PFA',
                  'None': 'None'
                }
              },

              bodyPartStorageSolution: {
                kind: 'string',
                variant: 'select',
                label: 'Final storage solution',
                options: {
                  "Ethanol": 'Ethanol 70%',
                  'Sodium Azide': 'Sodium Azide',
                  'Gadolinium Bath': 'Gadolinium Bath',
                  'PFA': 'PFA',
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
                  'Room temperature storage': 'Room temperature storage'
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
      label: "Blood collected (µL)",
      visibility: "visible",
      ref: "bloodCollected"
    },
    anesthesiaUsed: {
      kind: "const",
      label: "Anesthesia used",
      visibility: "visible",
      ref: "anesthesiaUsed"
    },
      anesthesiaType: {
    kind: "const",
    visibility: "visible",
    ref: "anesthesiaType"
  },

  otherAnesthesiaType: {
    kind: "const",
    visibility: "visible",
    ref: "otherAnesthesiaType"
  },

  anesthesiaDose: {
    kind: "const",
    visibility: "visible",
    ref: "anesthesiaDose"
  },
  isofluranePercentage: {
    kind: 'const',
    visibility: 'visible',
    ref: 'isofluranePercentage'
  },
  anesthesiaInductionTime: {
    kind: "const",
    visibility: "visible",
    ref: "anesthesiaInductionTime"
  },
    perfusionAnestheticType: {
      kind: "const",
      label: "Type of perfusion",
      visibility: "visible",
      ref: "perfusionAnestheticType"
    },
    ipAnestheticDose: {
      kind: "const",
      label: "Injection dose (µL)",
      visibility: "visible",
      ref: "ipAnestheticDose"
    },
    perfusionFlushingSolution: {
      kind: "const",
      label: "Perfusion flushing solution",
      visibility: "visible",
      ref: "perfusionFlushingSolution"
    },
    perfusionFlushingSolutionOther: {
      kind: "const",
      label: "Other perfusion flushing solution",
      visibility: "visible",
      ref: "perfusionFlushingSolutionOther"
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
          "Overnight storage solution": info.overnightStorageSolution,
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
    anesthesiaUsed: z.boolean().optional(),
    anesthesiaType: z.enum(["Isoflurane", "Other"]).optional(),
    otherAnesthesiaType: z.string().optional(),
    anesthesiaDose: z.number().min(0).optional(),
    isofluranePercentage: z.number().min(0).max(100).optional(),
    anesthesiaInductionTime: z.number().int().min(0).optional(),
    perfusionAnestheticType: z.enum([
    'Ip Injection',
    'Gas'
  ]).optional(),
    ipAnestheticDose: z.number().optional(),
    perfusionFlushingSolution:  z.enum([
    'PBS+Heparin',
    'Other'
  ]).optional(),
    perfusionFlushingSolutionOther: z.string().optional(),
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
          overnightStorageSolution: z.enum([
            'Ethanol',
            'Sodium Azide',
            'Gadolinium Bath',
            'PFA',
            'None'
          ]).optional(),
          bodyPartStorageSolution: z.enum([
          'Ethanol',
          'Sodium Azide',
          'Gadolinium Bath',
          'PFA',
          'None'
        ]),
          bodyPartStorageLocation: z.enum([
          'Fridge',
          '-20° Freezer',
          '-80° Freezer',
          'Room temperature storage'
        ])
        })
      )
      .optional(),
    
    additionalComments: z.string().optional()
  })
});
