/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

function createMRIDependentField<T>(field: T, fn: (typeOfMRI: string) => boolean) {
    return {
      kind: 'dynamic' as const,
      deps: ["typeOfMRI"] as const,
      render: (data: { typeOfMRI: string }) => {
        if (fn(data.typeOfMRI)) {
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
    dexSolutionDate: createMRIDependentField(
      {kind: "string",
       variant: "input",
       label: "Dexmedetomidine solution creation date",},
       (type) => type === 'Structural and FMRI'),

    dexBatchNumber: createMRIDependentField(
      {
        kind: "string",
       variant: "input",
       label: "Dexmedetomidine batch number",
       },
      (type) => type === 'Structural and FMRI'),
      
    isofluoraneBatchNumber: createMRIDependentField({
      kind: 'string',
      variant: "input",
      label: "Isofluorane batch number"
    }, (type) => type === "In-vivo structural"),
    isofluoraneAdjusted: createMRIDependentField({
      kind: 'boolean',
      variant: "radio",
      label: "Isofluorane adjusted from SOP?"
    }, (type) => type === "In-vivo structural"),

    isofluoraneAdjustedPercentage: {
      kind: "dynamic",
      deps: ["isofluoraneAdjusted"],
      render(data) {
        if(data.isofluoraneAdjusted && data.typeOfMRI === "In-vivo structural"){
          return {
            kind: "string",
            variant: "input",
            label: "Isofluorane percentage",
          }
        }
        return null
      }
    },
    breathingStable: createMRIDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Was breathing stable?"
    }, (type) => type !== "Ex-vivo structural" && type !== undefined),
    oxygenConcentration: createMRIDependentField({
      kind: "number",
      variant: "input",
      label: "Oxygen Concentration (0-100%)"
    },
    (type) => type === "Structural and FMRI" || type === "Quantitative"),
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
    dexSolutionDate: z.string().optional(),
    dexBatchNumber: z.string().optional(),
    isofluoraneBatchNumber: z.string().optional(),
    isofluoraneAdjusted: z.boolean().optional(),
    isofluoraneAdjustedPercentage: z.string().optional(),
    breathingStable: z.boolean(),
    oxygenConcentration: z.number()
  })
});
