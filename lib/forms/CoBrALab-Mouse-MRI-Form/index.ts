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
  tags: ['Mouse', 'MRI', 'Structural', 'fMRI'],
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
            "Structural and fMRI": "Structural and fMRI",
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
                        "In-cranio":"In-cranio",
                        "Ex-cranio": "Ex-cranio"
                    }
                }
            }
            return null
        }
    },
    dexSolutionDate: createMRIDependentField(
      {kind: "date",
       label: "Dexmedetomidine solution creation date",},
       (type) => type === 'Structural and fMRI'),

    dexBatchNumber: createMRIDependentField(
      {
        kind: "string",
       variant: "input",
       label: "Dexmedetomidine batch number",
       },
      (type) => type === 'Structural and fMRI'),
      
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
    (type) => type === "Structural and fMRI" || type === "Quantitative"),
     oxygenSaturation: createMRIDependentField({
      kind: "number",
      variant: "input",
      label: "SPO2 value (0-100%)"
    },
    (type) => type === "Structural and fMRI" || type === "Quantitative"),
    respirationRate: createMRIDependentField({
      kind: "number",
      variant: "input",
      label: "Respiration rate (breaths/min)"
    },
    (type) => type === "Structural and fMRI" || type === "Quantitative"),
    formOfMeasurement: createMRIDependentField({
      kind: "string",
      variant: "select",
      label: "How were Oxygen concentration, SPO2, and respiration rate recorded?",
      options: {
        "Waveform": "Waveform",
        "Numerical": "Numerical",
        "Manual":"Manual"
      }
    },
    (type) => type === "Structural and fMRI" || type === "Quantitative"),
    fmriIsofluorane: createMRIDependentField({
      kind: "number",
      variant: "slider",
      label: "fMRI Isofluorane percentage",
      max: 15,
      min: 0
    }, (type) => type ===  "Structural and fMRI"),
    fmriIsofluoraneColour: {
      kind: "dynamic",
      deps: ["fmriIsofluorane"],
      render(data){
        if(data.fmriIsofluorane === 2){
          return {
            kind: "string",
            variant: "radio",
            label: "Isofluorane colour code",
            options: {
              "yellow": "Yellow",
              "green": "Green"
            }
          }
        }
        return null
      }
    },
    otherComments: {
      kind: "string",
      variant: "textarea",
      label: "Please write any additonal comments/notes here"
    }
  },
  details: {
    description: "To record information about a mouse's MRI scan session. Keeps track of multiple scans within a single session. Can be filled in by either MRI operator or scan requester.",
    estimatedDuration: 4,
    instructions: ['Use this form for an individual mouse MRI sessions, which can contain multiple scans of different kinds. It is expected that the type of scan that are done on the mouse as well as certain information such as breath rate, and oxygenation level from the MRI monitor for certain scans.'],
    license: 'UNLICENSED',
    title: 'Mouse MRI Form'
  },
  measures: {
    handlerName: {
      kind: "const",
      label: "Handler name",
      ref: "handlerName"
    },
    mriOperator: {
      kind: "const",
      label: "MRI operator",
      ref: "mriOperator"
    },
    typeOfMRI: {
      kind: 'const',
      label: 'Type of MRI',
      ref: 'typeOfMRI'
    },
    coilType: {
      kind: 'const',
      label: 'Coil type',
      ref: 'coilType'
    },
    paraVisionVersion: {
      kind: 'const',
      label: 'Paravision Version',
      ref: 'paravisionVersion'
    },
    exVivoCranialStatus: {
      kind: 'const',
      label: 'Cranial status',
      ref: 'exVivoCranialStatus'
    },
    dexSolutionDate: {
      kind: 'const',
      label: 'Dexmedetomidine solution date',
      ref: 'dexSolutionDate'
    },
    dexSolutionBatchNumber: {
      kind: 'const',
      label: 'Dexmedetomidine batch number',
      ref: 'dexBatchNumber'
    },
    isofluoraneBatchNumber: {
      kind: 'const',
      label: 'Isofluorane batch number',
      ref: 'isofluoraneBatchNumber'
    },
    isofluoraneAdjusted: {
      kind: 'const',
      label: 'Isofluorane adjusted',
      ref: 'isofluoraneAdjusted'
    },
    isofluoraneAdjustedPercentage: {
      kind: 'const',
      label: 'Isofluorane adjusted percentage',
      ref: 'isofluoraneAdjustedPercentage'
    },
    breathingStable: {
      kind: 'const',
      label: 'Breathing stable',
      ref: 'breathingStable'
    },
    oxygenConcentration: {
      kind: 'const',
      label: 'Oxygen Concentration Percentage',
      ref: 'oxygenConcentration'
    },
    oxygenSaturation: {
      kind: 'const',
      label: 'Oxygen saturation',
      ref: 'oxygenSaturation'
    },
    respirationRate: {
      kind: 'const',
      label: 'Respiration rate',
      ref: 'respirationRate'
    },
    formOfMeasurement: {
      kind: 'const',
      label: 'Form of measurement',
      ref: 'formOfMeasurement'
    },
    fmriIsofluorane: {
      kind: 'const',
      label: "fMRI Isofluorane amount",
      ref: 'fmriIsofluorane'
    },
    fmriIsofluoraneColour: {
      kind: 'const',
      label: 'fMRI Isofluorane level colour',
      ref: 'fmriIsofluoraneColour'
    },
    otherComments: {
      kind: 'const',
      label: "additonal comments",
      ref:'otherComments'
    }
  },
  validationSchema: z.object({
    handlerName: z.string(),
    mriOperator: z.string(),
    typeOfMRI: z.string(),
    coilType: z.string(),
    paravisionVersion: z.string(),
    exVivoCranialStatus: z.string().optional(),
    dexSolutionDate: z.date().optional(),
    dexBatchNumber: z.string().optional(),
    isofluoraneBatchNumber: z.string().optional(),
    isofluoraneAdjusted: z.boolean().optional(),
    isofluoraneAdjustedPercentage: z.string().optional(),
    breathingStable: z.boolean(),
    oxygenConcentration: z.number().optional(),
    oxygenSaturation: z.number().optional(),
    respirationRate: z.number().optional(),
    formOfMeasurement: z.string().optional(),
    fmriIsofluorane: z.number().optional(),
    fmriIsofluoraneColour: z.string().optional(),
    otherComments: z.string().optional()

  })
});
