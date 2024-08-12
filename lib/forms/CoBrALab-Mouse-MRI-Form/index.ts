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
    mriOperatorName: {
        kind: "string",
        variant: "input",
        label: "Name of MRI operator"
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
    scanRecordInfo: {
      kind: "record-array",
      label: "MRI scan record",
      fieldset: {
        typeOfMRI: {
          kind: "string",
          variant: "select",
          label: "Type of MRI",
          options: {
            "Ex-vivo structural":"Ex-vivo structural",
            "In-vivo structural": "In-vivo structural",
            "Structural and fMRI": "Structural and fMRI",
            "Quantitative":"Quantitative"
        }
        },
        exVivoCranioStatus: createMRIDependentField(
          {  kind: "string",
                    variant: "radio",
                    label: "Type of ex-vivo scan",
                    options: {
                        "In-cranio":"In-cranio",
                        "Ex-cranio": "Ex-cranio"
                    }},
           (type) => type === 'Ex-vivo structural'),

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
      }
    },
  },
  details: {
    description: "This form is used to record the data tracked in a mouse's MRI session",
    estimatedDuration: 1,
    instructions: ['Please fill out this for individual mouse MRI sessions'],
    license: 'UNLICENSED',
    title: 'Mouse MRI Form'
  },
  measures: {
    handlerName: {
      kind: "const",
      label: "Handler name",
      ref: "handlerName"
    },
    mriOperatorName: {
      kind: "const",
      label: "MRI operator",
      ref: "mriOperatorName"
    },
    coilType: {
      kind: 'const',
      label: 'Coil type',
      ref: 'coilType'
    },
    paravisionVersion: {
      kind: 'const',
      label: 'Paravision Version',
      ref: 'paravisionVersion'
    },
  },
  validationSchema: z.object({
    handlerName: z.string(),
    mriOperatorName: z.string(),
    coilType: z.string(),
    paravisionVersion: z.string(),
    scanRecordInfo: z.array(z.object({
      typeOfMRI: z.string(),
      exVivoCranioStatus: z.string().optional(),
      dexSolutionDate: z.date().optional(),
      dexBatchNumber: z.string().optional(),
      isofluoraneBatchNumber: z.string().optional(),
      isofluoraneAdjusted: z.boolean().optional(),
      isofluoraneAdjustedPercentage: z.string().optional(),
      breathingStable: z.boolean().optional(),
      oxygenConcentration: z.number().max(100).optional(),
      oxygenSaturation: z.number().max(100).optional(),
      respirationRate: z.number().max(350).optional(),
      formOfMeasurement: z.string().optional(),
      fmriIsofluorane: z.number().optional(),
      fmriIsofluoraneColour: z.string().optional(),
      otherComments: z.string().optional()

    })),
  })
});