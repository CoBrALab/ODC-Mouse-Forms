/* eslint-disable perfectionist/sort-objects */

import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core'
import { z } from '/runtime/v1/zod@3.23.x'

const mouseSides = {
             "Right": "Right",
             "Left": "Left"
             }  as const

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Surgery', 'Ovariectomy','Intracerebral injection'],
  internal: {
    edition: 5,
    name: 'MOUSE_SURGERY_FORM'
  },
  content: {
    surgeryType: {
      kind: "set",
      variant: "listbox",
      label: "Type of surgery",
      options: {
        "Ovariectomy": "Ovariectomy",
        "Hormone capsule implant": "Hormone capsule implant",
        "Electrode implant": "Electrode implant",
        "Fiber optic implant": "Fiber optic implant",
        "Intracerebral injection": "Intracerebral injection"
      }
    },

    intracerebralInjectionType: {
      kind: "dynamic",
      deps: ["surgeryType"],
      render(data) {
        if(data.surgeryType?.has("Intracerebral injection")){
          return {
          kind: "string",
          variant: "select",
          label: "Intracerebral injection type",
          options: {
            "PBS": "PBS",
            "Ms-PFF": "Ms-PFF",
            "Hu-PFF": "Hu-PFF"
          }
          }
        }
        return null
      }
    },

    intracerebralInjectionBatchType: {
      kind: "dynamic",
      deps: ["surgeryType"],
      render(data) {
        if(data.surgeryType?.has("Intracerebral injection")){
          return {
          kind: "string",
          variant: "input",
          label: "Intracerebral injection batch type"
          }
        }
        return null
      }
    },
    
    analgesiaUsed: {
      kind: "boolean",
      variant: "radio",
      label: "Analgesia used"
    },

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

    anesthesiaUsed: {
      kind: "boolean",
      variant: "radio",
      label: "Anesthesia used"
    },

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

    anesthesiaDuration: {
      kind: "dynamic",
      deps: ["anesthesiaUsed","anesthesiaAdministrationType"],
      render(data) {
        if(data.anesthesiaUsed && data.anesthesiaAdministrationType === "Inhalation"){
          return {
            kind: "number",
            variant: "input",
            label: "Duration of Anesthesia provided (minutes)"
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
            kind: "number",
            variant: "input",
            label: "Time until recovery from Anesthesia (minutes)"
          }
        }
        return null
      }
    },

    stereotaxUsed: {
      kind: "boolean",
      variant: "radio",
      label: "Stereotax used"
    },

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

    hydrationProvided: {
      kind: "boolean",
      variant: "radio",
      label: "Was hydration provided"
    },

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

    ovariectomyType: {
      kind: "dynamic",
      deps: ["surgeryType"],
      render(data) {
        if(data.surgeryType?.has("Ovariectomy")){
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
             options: mouseSides
          }
        }
        return null
      }
    },
    ovariectomyMouseGroup: {
      kind: "dynamic",
      deps: ["surgeryType"],
      render(data) {
        if(data.surgeryType?.has("Ovariectomy")){
          return {
             kind: "string",
             variant: "select",
             label: "Ovariectomy group",
             options: {
             "Sham":"Sham",
             "Experiment": "Experiment"
             }
          }
        }
        return null
      }
    },

    hormoneCapsuleImplantType: {
      kind: "dynamic",
      deps: ["surgeryType"],
      render(data) {
        if(data.surgeryType?.has("Hormone capsule implant")){
          return {
            kind: "string",
            variant: "select",
            label: "Hormone capsule implant type",
            options: {
              "Vehicle": "Vehicle",
              "Estradiol": "Estradiol"
            }
          }
        }
        return null
      }
    },

    hormoneCapsuleImplantConcentration: {
      kind: "dynamic",
      deps: ["hormoneCapsuleImplantType"],
      render(data) {
        if(data.hormoneCapsuleImplantType === "Estradiol"){
          return {
            kind: "number",
            variant: "input",
            label: "Estradiol concentration (µg/mL)"
          }
        }
        return null
      }
    },

    hormoneCapsuleImplantSide: {
      kind: "dynamic",
      deps: ["surgeryType"],
      render(data) {
        if(data.surgeryType?.has("Hormone capsule implant")){
          return {
            kind: "string",
            variant: "select",
            label: "Hormone capsule implant side",
            options: mouseSides
          }
        }
        return null
      }
    },

    brainSurgeryPaxinosMLCoords: {
      kind: "dynamic",
      deps: ["stereotaxUsed", "surgeryType"],
      render(data) {
        if( data.stereotaxUsed && (data.surgeryType?.has('Electrode implant') || data.surgeryType?.has('Fiber optic implant') || data.surgeryType?.has('Intracerebral injection'))){
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
        if( data.stereotaxUsed && (data.surgeryType?.has('Electrode implant') || data.surgeryType?.has('Fiber optic implant') || data.surgeryType?.has('Intracerebral injection'))){
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
        if( data.stereotaxUsed && (data.surgeryType?.has('Electrode implant') || data.surgeryType?.has('Fiber optic implant') || data.surgeryType?.has('Intracerebral injection'))){
          return {
            kind: "number",
            variant: "input",
            label: "DV Paxinos coordinate"
          }
        }
        return null
      }
    },

    surgeryDuration: {
      kind: "number",
      variant: "input",
      label: "Surgery duration (minutes)"
    },


    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }
    

  },
  clientDetails: {
    estimatedDuration: 3,
    instructions: ['Please fill this form whenever a mouse goes through a surgery.']
  },
  details: {
    description: 'Describes the information about a surgery done upon a Mouse.',
    license: 'Apache-2.0',
    title: 'Mouse Surgery Form'
  },
  measures: {
    analgesiaUsed: {
      kind: "const",
      visibility: "visible",
      ref: "analgesiaUsed"
    },
    analgesiaChemicalName: {
      kind: "const",
      visibility: "visible",
      ref: "analgesiaChemicalName"
    },
    analgesiaVolume: {
      kind: "const",
      visibility: "visible",
      ref: "analgesiaVolume"
    },
    anesthesiaUsed: {
      kind: "const",
      visibility: "visible",
      ref: "anesthesiaUsed"
    },
    anesthesiaChemicalName: {
      kind: "const",
      visibility: "visible",
      ref: "anesthesiaChemicalName"
    },
    anesthesiaAdministrationType:{
      kind: "const",
      visibility: "visible",
      ref: "anesthesiaAdministrationType"
    },
    anesthesiaVolume: {
      kind: "const",
      visibility: "visible",
      ref: "anesthesiaVolume"
    },
    anesthesiaDuration: {
      kind: "const",
      visibility: "visible",
      ref: "anesthesiaDuration"
    },
    anesthesiaRecoveryTime: {
      kind: "const",
      visibility: "visible",
      ref: "anesthesiaRecoveryTime"
    },
    hydrationProvided: {
      kind: "const",
      visibility: "visible",
      ref: "hydrationProvided"
    },
    hydrationVolume: {
      kind: "const",
      visibility: "visible",
      ref: "hydrationVolume"
    },
    intracerebralInjectionType: {
      kind: "const",
      visibility: "visible",
      ref: "intracerebralInjectionType"
    },
    intracerebralInjectionBatchType: {
      kind: "const",
      visibility: "visible",
      ref: "intracerebralInjectionBatchType"
    },
    stereotaxUsed: {
      kind: "const",
      visibility: "visible",
      ref: "stereotaxUsed"
    },
    stereotaxId: {
      kind: "const",
      visibility: "visible",
      ref: "stereotaxId"
    },
    surgeryType: {
      kind: "computed",
      label: "Type of surgery",
      visibility: "visible",
      value: (data) => data.surgeryType ? Array.from(data.surgeryType).join(" ") : ""
    },
    ovariectomyType: {
      kind: "const",
      visibility: "visible",
      ref: "ovariectomyType"
    },
    ovariectomySide: {
      kind: "const",
      visibility: "visible",
      ref: "ovariectomySide"
    },
    ovariectomyMouseGroup: {
      kind: "const",
      visibility: "visible",
      ref: "ovariectomyMouseGroup"
    },
    hormoneCapsuleImplantType: {
      kind: "const",
      visibility: "visible",
      ref: "hormoneCapsuleImplantType"
    },
    hormoneCapsuleImplantConcentration: {
      kind: "const",
      visibility: "visible",
      ref: "hormoneCapsuleImplantConcentration"
    },
    hormoneCapsuleImplantSide: {
      kind: "const",
      visibility: "visible",
      ref: "hormoneCapsuleImplantSide"
    },
    brainSurgeryPaxinosMLCoords:{
      kind: "const",
      visibility: "visible",
      ref: "brainSurgeryPaxinosMLCoords"
    },
    brainSurgeryPaxinosAPCoords:{
      kind: "const",
      visibility: "visible",
      ref: "brainSurgeryPaxinosAPCoords"
    },
    brainSurgeryPaxinosDVCoords:{
      kind: "const",
      visibility: "visible",
      ref: "brainSurgeryPaxinosDVCoords"
    },
    surgeryDuration: {
      kind: "const",
      visibility: "visible",
      ref:"surgeryDuration"
    },
    additionalComments: {
      kind: "const",
      visibility: "visible",
      ref: "additionalComments"
    }
  },
  validationSchema: z.object({
      analgesiaUsed: z.boolean().optional(),
      analgesiaChemicalName: z.string().optional(),
      analgesiaVolume: z.number().min(0).optional(),
      anesthesiaUsed: z.boolean().optional(),
      anesthesiaChemicalName: z.string().optional(),
      anesthesiaAdministrationType: z.enum(["Inhalation", "Intraperitoneal", "Intravenous"]).optional(),
      anesthesiaVolume: z.number().min(0).optional(),
      anesthesiaDuration: z.number().min(0).int().optional(),
      anesthesiaRecoveryTime: z.number().min(0).int().optional(),
      hydrationProvided: z.boolean().optional(),
      hydrationVolume:  z.number().min(0).optional(),
      intracerebralInjectionType: z.enum(["PBS", "Ms-PFF","Hu-PFF"]).optional(),
      intracerebralInjectionBatchType: z.string().optional(),
      stereotaxUsed: z.boolean().optional(),
      stereotaxId: z.string().optional(),
      surgeryType: z.set(z.enum(["Ovariectomy", "Hormone capsule implant", "Electrode implant", "Fiber optic implant", "Intracerebral injection"])),
      ovariectomyType: z.enum(["Unilateral", "Bilateral"]).optional(),
      ovariectomyMouseGroup: z.enum(["Sham", "Experiment"]).optional(),
      ovariectomySide: z.enum(["Right", "Left"]).optional(),
      hormoneCapsuleImplantType: z.enum(["Vehicle", "Estradiol"]).optional(),
      hormoneCapsuleImplantConcentration: z.number().positive().optional(),
      hormoneCapsuleImplantSide: z.enum(["Right", "Left"]).optional(),
      brainSurgeryPaxinosMLCoords: z.number().min(-5).max(5).optional(),
      brainSurgeryPaxinosAPCoords: z.number().min(-8.8).max(6).optional(),
      brainSurgeryPaxinosDVCoords: z.number().min(0).max(6.4).optional(),
      surgeryDuration: z.number().min(0).optional(),
      additionalComments: z.string().optional(),

  }).superRefine((data, ctx) => {
    if (data.surgeryType.size === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["surgeryType"],
        message: "Select a minimum of one type of surgery."
      });
    }
    if (data.surgeryType?.has("Ovariectomy") && data.ovariectomyType === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["ovariectomyType"],
        message: "This field is required when the surgery type is Ovariectomy."
      });
    }
    if (data.surgeryType?.has("Ovariectomy") && data.ovariectomyMouseGroup === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["ovariectomyMouseGroup"],
        message: "This field is required when the surgery type is Ovariectomy."
      });
    }
    if (data.ovariectomyType === "Unilateral" && data.ovariectomySide === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["ovariectomySide"],
        message: "This field is required when the ovariectomy is Unilateral."
      });
    }
    if (data.surgeryType?.has("Hormone capsule implant") && data.hormoneCapsuleImplantType === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["hormoneCapsuleImplantType"],
        message: "This field is required when the surgery type is Hormone capsule implant."
      });
    }
    if (data.hormoneCapsuleImplantType === "Estradiol" && data.hormoneCapsuleImplantConcentration === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["hormoneCapsuleImplantConcentration"],
        message: "This field is required when the implant type is Estradiol."
      });
    }
    if (data.surgeryType?.has("Hormone capsule implant") && data.hormoneCapsuleImplantSide === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["hormoneCapsuleImplantSide"],
        message: "This field is required when the surgery type is Hormone capsule implant."
      });
    }
  })
});
