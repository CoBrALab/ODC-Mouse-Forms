/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

function createDependentField<T>(field: T) {
    return {
      kind: 'dynamic' as const,
      deps: ["In-vivo structural"] as const,
      render: (data) => {
        if (data["In-vivo structural"] === "In-vivo structural") {
          return field;
        }
        return null;
      }
    };
  }

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'MRI', 'Structural', 'FMRI'],
  internal: {
    edition: 1,
    name: 'MOUSE_MRI_FORM'
  },
  content: {
    handlerName: {
        kind: "string",
        variant: "input",
        label: "Name of handler"
    },
    mriOperator: {
        kind: "string",
        variant: "input",
        label: "MRI operator"
    },
    coilType: {
        kind: "string",
        variant: "radio",
        label: "Type of coil",
        options: {
            "Cryocoil":"Cryocoil",
            "23m volumetric": "23m volumetric"
        }
    },
    paravisionVersion: {
        kind: "string",
        variant: "radio",
        label: "Paravision version",
        options: {
            "PV6":"PV6",
            "PV5": "PV5"
        }
    },
    typeOfMRI: {
        kind: "string",
        variant: 'select',
        label:"Type of MRI done",
        options: {
            "Ex-vivo structural":"Ex-vivo structural",
            "In-vivo structural": "In-vivo structural",
            "Structural and FMRI": "Structural and FMRI",
            "Quantitative":"Quantitative"
        }
    },
    exVivoCranialStatus: {
        kind: "dynamic",
        deps: ["typeOfMRI"],
        render(data) {
            if (data.typeOfMRI === "Ex-vivo structural"){
                return {
                    kind: "string",
                    variant: "radio",
                    label: "Type of ex-vivo scan",
                    options: {
                        "In-cranial":"In-cranial",
                        "Ex-cranial": "Ex-cranial"
                    }
                }
            }
            return null
        }
    },
    testQuestion: createDependentField({
        kind: "boolean",
        variant:"radio",
        label: "test"
    })
    
  },
  details: {
    description: "This form is used to record the data tracked in a mouse's MRI session",
    estimatedDuration: 1,
    instructions: ['Please fill out this for individual mouse MRI sessions'],
    license: 'UNLICENSED',
    title: 'Mouse MRI Form'
  },
  measures: {},
  validationSchema: z.object({
    handlerName: z.string(),
    mriOperator: z.string(),
    typeOfMRI: z.string(),
    coilType: z.string(),
    paravisionVersion: z.string(),
    exVivoCranialStatus: z.string().optional(),
    testQuestion: z.string().optional()
  })
});
