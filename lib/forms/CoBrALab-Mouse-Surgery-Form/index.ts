/* eslint-disable perfectionist/sort-objects */

import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core'
import { z } from '/runtime/v1/zod@3.23.x'

type TreatmentType =  "Surgery" | "Wound treatment" | "Re-stitching" | "Intracerebral injection"

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
    edition: 3,
    name: 'MOUSE_SURGERY_FORM'
  },
  content: {
    treatmentType: {
      kind: "string",
      variant: "select",
      label: "Select physical intervention",
      options: {
        "Surgery": "Surgery",
        "Wound treatment": "Wound treatment",
        "Re-stitching": "Re-stitching",
        "Intracerebral injection": "Intracerebral injection"
      }
    },
    analgesiaUsed: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Analgesia used"
    }, (type) => type === "Surgery" || type === "Re-stitching" || type === "Intracerebral injection"),

    analgesiaChemicalName: {
      kind: "dynamic",
      deps: ["analgesiaUsed"],
      render(data) {
        if(data.analgesiaUsed){
          return {
            kind: "string",
            variant: "input",
            label: "Analgesia chemical name"
          }
        }
        return null
      }
    },
    analgesiaVolume: {
       kind: "dynamic",
       deps: ["analgesiaUsed"],
       render(data) {
        if(data.analgesiaUsed){
          return {
          kind: "number",
          variant: "input",
          label: "Analgesia volume (ml)"
          }
        }
        return null
      }
      
    },

    anesthesiaUsed: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Anesthesia used"
    }, (type) => type === "Surgery" || type === "Re-stitching" || type === "Intracerebral injection"),

    anesthesiaAdministrationType: {
      kind: "dynamic",
      deps: ["anesthesiaUsed"],
      render(data) {
        if(data.anesthesiaUsed){
          return {
            kind: "string",
            variant: "select",
            label: "Anesthesia administration type",
            options: {
              "Inhalation": "Inhalation",
              "Intraperitoneal":"Intraperitoneal",
              "Intravenous": "Intravenous"
            }
          }
        }
        return null
      }
    },

    anesthesiaVolume: {
      kind: "dynamic",
       deps: ["anesthesiaUsed","anesthesiaAdministrationType"],
       render(data) {
        if(data.anesthesiaUsed && data.anesthesiaAdministrationType !== "Inhalation"){
          return {
          kind: "number",
          variant: "input",
          label: "Anesthesia volume (ml)"
          }
        }
        return null
      }
      
    },
    
    anesthesiaChemicalName: {
      kind: "dynamic",
      deps: ["anesthesiaUsed"],
      render(data) {
        if(data.anesthesiaUsed){
          return {
            kind: "string",
            variant: "input",
            label: "Anesthesia chemical name"
          }
        }
        return null
      }
    },

    anesthesiaRecoveryTime: {
      kind: "dynamic",
      deps: ["anesthesiaUsed"],
      render(data) {
        if(data.anesthesiaUsed){
          return {
            kind: "string",
            variant: "input",
            label: "Time until recovery from Anesthesia (minutes)"
          }
        }
        return null
      }
    },

    stereotaxUsed: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Stereotax used"
    },(type) => type === "Surgery" || type === "Re-stitching" || type === "Intracerebral injection"),

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

    hydrationProvided: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Was hydration provided"
    }, (type) => type === "Surgery" || type === "Intracerebral injection"),

    hydrationVolume: {
      kind: "dynamic",
      deps: ["hydrationProvided"],
      render(data) {
       if(data.hydrationProvided){
         return {
         kind: "number",
         variant: "input",
         label: "Hydration solution volume (ml)"
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

    treatmentDuration: createDependentField({
      kind: "number",
      variant: "input",
      label: "Treatment duration (days)"
    }, (type) => type === "Wound treatment"),

    surgeryDuration: createDependentField({
      kind: "number",
      variant: "input",
      label: "Surgery duration (minutes)"
    }, (type) => type === "Surgery" || type === "Intracerebral injection"),


    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }
    

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
    analgesiaUsed: {
      kind: "const",
      ref: "analgesiaUsed"
    },
    analgesiaChemicalName: {
      kind: "const",
      ref: "analgesiaChemicalName"
    },
    analgesiaVolume: {
      kind: "const",
      ref: "analgesiaVolume"
    },
    anesthesiaUsed: {
      kind: "const",
      ref: "anesthesiaUsed"
    },
    anesthesiaChemicalName: {
      kind: "const",
      ref: "anesthesiaChemicalName"
    },
    anesthesiaAdministrationType:{
      kind: "const",
      ref: "anesthesiaAdministrationType"
    },
    anesthesiaVolume: {
      kind: "const",
      ref: "anesthesiaVolume"
    },
    anesthesiaRecoveryTime: {
      kind: "const",
      ref: "anethesiaRecoveryTime"
    },
    hydrationProvided: {
      kind: "const",
      ref: "hydrationProvided"
    },
    hydrationVolume: {
      kind: "const",
      ref: "hydrationVolume"
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
    },
    treatmentDuration: {
      kind: "const",
      ref:"treatmentDuration"
    },
    surgeryDuration: {
      kind: "const",
      ref:"surgeryDuration"
    },
    additionalComments: {
      kind: "const",
      ref: "additionalComments"
    }
  },
  validationSchema: z.object({
      treatmentType: z.enum(["Surgery", "Wound treatment","Re-stitching", "Intracerebral injection"]),
      analgesiaUsed: z.boolean().optional(),
      analgesiaChemicalName: z.string().optional(),
      analgesiaVolume: z.number().min(0).optional(),
      anesthesiaUsed: z.boolean().optional(),
      anesthesiaChemicalName: z.string().optional(),
      anesthesiaAdministrationType: z.enum(["Inhalation", "Intraperitoneal", "Intravenous"]),
      anesthesiaVolume: z.number().min(0).optional(),
      anesthesiaRecoveryTime: z.number().min(0).int().optional(),
      hydrationProvided: z.boolean().optional(),
      hydrationVolume:  z.number().min(0).optional(),
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
      treatmentProvided: z.string().optional(),
      treatmentDuration: z.number().min(0).int().optional(),
      surgeryDuration: z.number().min(0).optional(),
      additionalComments: z.string().optional(),

  })
});
