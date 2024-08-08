/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

function createDependentField<T>(field: T, fn: (treatmentType: string) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['treatmentType'] as const,
    render: (data: { treatmentType: string }) => {
      if (fn(data.treatmentType)) {
        return field;
      }
      return null;
    }
  };
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Surgery', 'Vet Care', 'Wound Treatment', 'Ovariectomy'],
  internal: {
    edition: 1,
    name: 'MOUSE_SURGERY_FORM'
  },
  content: {
    treatmentType: {
      kind: "string",
      variant: "select",
      label: "Select physical intervention",
      options: {
        "Surgery": "Surgery",
        "Wound treatment": "Wound treatment"
      }
    },
    aneglesiaUsed: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Aneglesia used"
    }, (type) => type === "Surgery"),

    aneglesiaType: {
      kind: "dynamic",
      deps: ["aneglesiaUsed"],
      render(data) {
        if(data.aneglesiaUsed){
          return {
            kind: "string",
            variant: "input",
            label: "Aneglesia type"
          }
        }
        return null
      }
    },
    aneglesiaVolume: {
       kind: "dynamic",
       deps: ["aneglesiaUsed"],
       render(data) {
        if(data.aneglesiaUsed){
          return {
          kind: "string",
          variant: "input",
          label: "Aneglesia volume"
          }
        }
        return null
      }
      
    },
    stereotaxUsed: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Stereotax used"
    },(type) => type === "Surgery"),

    stereotaxId:{
      kind: "dynamic",
      deps: ["stereotaxUsed"],
      render(data) {
        if(data.stereotaxUsed){
          return {
            kind: "string",
            variant: "input",
            label: "Stereotax ID"
          }
        }
        return null
      }

    },

    surgeryType: createDependentField({
      kind: "string",
      variant: "select",
      label: "Type of surgery",
      options: {
        "Ovariectomy": "Ovariectomy",
        "Electrode implant": "Electrode implant",
        "Fiber optic implant": "Fiber optic implant"
      }
    },(type) => type === "Surgery"),
    ovariectomyType: {
      kind: "dynamic",
      deps: ["surgeryType"],
      render(data) {
        if(data.surgeryType === "Ovariectomy"){
          return {
             kind: "string",
             variant: "select",
             label: "Ovariectomy sides",
             options: {
             "Unilateral":"Unilateral",
             "Bilateral": "Bilateral"
             }
          }
        }
        return null
      }
    },
    ovariectomySide: {
      kind: "dynamic",
      deps: ["ovariectomyType"],
      render(data) {
        if(data.ovariectomyType === "Unilateral"){
          return {
             kind: "string",
             variant: "select",
             label: "Ovariectomy side",
             options: {
             "Right":"Right",
             "Left": "Left"
             }
          }
        }
        return null
      }
    },
    ovariectomyGroup: {
      kind: "dynamic",
      deps: ["surgeryType"],
      render(data) {
        if(data.surgeryType === "Ovariectomy"){
          return {
             kind: "string",
             variant: "select",
             label: "Ovariectomy group",
             options: {
             "Control":"Control",
             "Experiment": "Experiment"
             }
          }
        }
        return null
      }
    },

    woundDateReported: createDependentField({
      kind: "date",
      label: "Wound reported date"
    }, (type) => type === "Wound treatment"),

    clinicalCondition: createDependentField({
      kind: "string",
      variant: "input",
      label: "Clincal condition"
    }, (type) => type === "Wound treatment"),
    
    treatmentProvided: createDependentField({
      kind: "string",
      variant: "input",
      label: "Treatment provided"
    }, (type) => type === "Wound treatment"),
    

  },
  details: {
    description: 'Form to be filled in when a mouse goes through a surgery or veterinary care',
    estimatedDuration: 1,
    instructions: ['Please fill this form whenever a mouse has to through a surgery or has gone through veterinary care'],
    license: 'UNLICENSED',
    title: 'Mouse surgery, wound treatment and veterinary care form'
  },
  measures: {
    treatmentType: {
      kind: "const",
      label: "Selected physical intervention",
      ref: "treatmentType"
    },
    aneglesiaUsed: {
      kind: "const",
      ref: "aneglesiaUsed"
    },
    aneglesiaType: {
      kind: "const",
      ref: "aneglesiaType"
    },
    aneglesiaVolume: {
      kind: "const",
      ref: "aneglesiaVolume"
    },
    stereotaxUsed: {
      kind: "const",
      ref: "stereotaxUsed"
    },
    stereotaxId: {
      kind: "const",
      ref: "stereotaxId"
    },
    surgeryType: {
      kind: "const",
      ref: "surgeryType"
    },
    ovariectomyType: {
      kind: "const",
      ref: "ovariectomyType"
    },
    ovariectomySide: {
      kind: "const",
      ref: "ovariectomySide"
    },
    ovariectomyGroup: {
      kind: "const",
      ref: "ovariectomyGroup"
    },
    woundDateReported: {
      kind: "const",
      ref: "woundDateReported"
    },
    clinicalCondition: {
      kind: "const",
      ref: "clinicalCondition"
    },
    treatmentProvided: {
      kind: "const",
      ref: "treatmentProvided"
    }
  },
  validationSchema: z.object({
    treatmentType: z.string(),
    aneglesiaUsed: z.boolean().optional(),
    aneglesiaType: z.string().optional(),
    aneglesiaVolume: z.string().optional(),
    stereotaxUsed: z.boolean().optional(),
    stereotaxId: z.string().optional(),
    surgeryType: z.string().optional(),
    ovariectomyType: z.string().optional(),
    ovariectomyGroup: z.string().optional(),
    ovariectomySide: z.string().optional(),
    woundDateReported: z.date().optional(),
    clinicalCondition: z.string().optional(),
    treatmentProvided: z.string().optional()

  })
});
