/* eslint-disable perfectionist/sort-objects */

import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core'
import { z } from '/runtime/v1/zod@3.23.x'

type TreatmentType =  "Surgery" | "Wound treatment"

function createDependentField<const T>(field: T, fn: (treatmentType: TreatmentType) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['treatmentType'] as const,
    render: (data: { treatmentType: TreatmentType }) => {
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
          kind: "number",
          variant: "input",
          label: "Aneglesia volume (ml)"
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
    ovariectomyMouseGroup: {
      kind: "dynamic",
      deps: ["surgeryType"],
      render(data) {
        if(data.surgeryType === "Ovariectomy"){
          return {
             kind: "string",
             variant: "select",
             label: "Ovariectomy group (control/experiment)",
             options: {
             "Control":"Control",
             "Experiment": "Experiment"
             }
          }
        }
        return null
      }
    },

    brainSurgeryPaxinosMLCoords: {
      kind: "dynamic",
      deps: ["stereotaxUsed", "surgeryType"],
      render(data) {
        if( data.stereotaxUsed && (data.surgeryType !== 'Ovariectomy' && data.surgeryType !== undefined)){
          return {
            kind: "number",
            variant: "input",
            label: "ML Paxinos coordinate"
          }
        }
        return null
      }
    },
    brainSurgeryPaxinosAPCoords: {
      kind: "dynamic",
      deps: ["stereotaxUsed","surgeryType"],
      render(data) {
        if( data.stereotaxUsed && (data.surgeryType !== 'Ovariectomy' && data.surgeryType !== undefined)){
          return {
            kind: "number",
            variant: "input",
            label: "AP Paxinos coordinate"
          }
        }
        return null
      }
    },

    brainSurgeryPaxinosDVCoords: {
      kind: "dynamic",
      deps: ["stereotaxUsed","surgeryType"],
      render(data) {
        if( data.stereotaxUsed && (data.surgeryType !== 'Ovariectomy' && data.surgeryType !== undefined)){
          return {
            kind: "number",
            variant: "input",
            label: "DV Paxinos coordinate"
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
  clientDetails: {
    estimatedDuration: 3,
    instructions: ['Please fill this form whenever a mouse has to through a surgery or has gone through veterinary care. If the wound treatment section is selected to be filled in, please use the information written on the card provided by the veterinary team']
  },
  details: {
    description: 'Describes the information about a physical intervention done upon a Mouse, either in the form of as surgery or as a wound treatment done by the veterinary team.',
    license: 'Apache-2.0',
    title: 'Mouse Surgery and Wound Treatment Form'
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
    ovariectomyMouseGroup: {
      kind: "const",
      ref: "ovariectomyMouseGroup"
    },
    brainSurgeryPaxinosMLCoords:{
      kind: "const",
      ref: "brainSurgeryPaxinosMLCoords"
    },
    brainSurgeryPaxinosAPCoords:{
      kind: "const",
      ref: "brainSurgeryPaxinosAPCoords"
    },
    brainSurgeryPaxinosDVCoords:{
      kind: "const",
      ref: "brainSurgeryPaxinosDVCoords"
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
      treatmentType: z.enum(["Surgery", "Wound treatment"]),
      aneglesiaUsed: z.boolean().optional(),
      aneglesiaType: z.string().optional(),
      aneglesiaVolume: z.number().min(0).optional(),
      stereotaxUsed: z.boolean().optional(),
      stereotaxId: z.string().optional(),
      surgeryType: z.enum(["Ovariectomy", "Electrode implant", "Fiber optic implant"]).optional(),
      ovariectomyType: z.enum(["Unilateral", "Bilateral"]).optional(),
      ovariectomyMouseGroup: z.enum(["Control", "Experiment"]).optional(),
      ovariectomySide: z.enum(["Right", "Left"]).optional(),
      brainSurgeryPaxinosMLCoords: z.number().min(-5).max(5).optional(),
      brainSurgeryPaxinosAPCoords: z.number().min(-8.8).max(6).optional(),
      brainSurgeryPaxinosDVCoords: z.number().min(0).max(6.4).optional(),
      woundDateReported: z.date().optional(),
      clinicalCondition: z.string().optional(),
      treatmentProvided: z.string().optional()

  })
});
