/* eslint-disable perfectionist/sort-objects */

import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core'
import { z } from '/runtime/v1/zod@3.23.x'


const scanNameOptions = {
  "Localizer": "Localizer",
  "T1_FLASH_3D_100iso_10deg": "T1_FLASH_3D_100iso_10deg",
  "FLASH_3D_reduced": "FLASH_3D_reduced",
  "ADJ_B0MAP": "ADJ_B0MAP",
  "revNoTrigAdjPEOffEPI": "revNoTrigAdjPEOffEPI",
  "B0 Map": "B0 Map",
  "B1map_RARE_60deg_4s": "B1map_RARE_60deg_4s",
  "B1map_RARE_120deg_4s": "B1map_RARE_120deg_4s",
  "MGE_MTOff": "MGE_MTOff",
  "MGE_MTOn": "MGE_MTOn",
  "MGE_MTOff_Tw1_30deg": "MGE_MTOff_Tw1_30deg",
  "T2star_FID_EPI_sat_dan_ver_original": "T2star_FID_EPI_sat_dan_ver_original",
  "exvivoDanFLASH": "exvivoDanFLASH"

}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'MRI', 'Structural', 'fMRI'],
  internal: {
    edition: 2,
    name: 'MOUSE_MRI_FORM'
  },
  content: {
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
        "Cryocoil": "Cryocoil",
        "23 mm volumetric": "23 mm volumetric",
        "40 mm volumetric rat coil": "40 mm volumetric rat coil",
        "86 mm volumetric coil": "86 mm volumetric coil",
        "mouse surface coil": "mouse surface coil",
        "4 coil array mouse surface coil": "4 coil array mouse surface coil",
        "10 mm loop coil": "10 mm loop coil",
        "30 mm loop coil": "30 mm loop coil"

      }
    },
    paravisionVersion: {
      kind: "string",
      variant: "radio",
      label: "Paravision version",
      options: {
        "PV6": "PV6",
        "PV5": "PV5"
      }
    },

    exVivoScan: {
      kind: "boolean",
      variant: "radio",
      label: "Was scan done on ex-vivo subject?"
    },
    exVivoCranioStatus: {
      kind: 'dynamic',
      deps: ['exVivoScan'],
      render(data) {
        if (data.exVivoScan) {
          return {
            kind: "string",
            variant: "radio",
            label: "Type of ex-vivo scan",
            options: {
              "In-cranio": "In-cranio",
              "Ex-cranio": "Ex-cranio"
            }
          }
        }
        return null
      }
    },

    exVivoScanningMedium: {
      kind: 'dynamic',
      deps: ['exVivoScan'],
      render(data) {
        if (data.exVivoScan) {
          return {
            kind: "string",
            variant: "radio",
            label: "Ex-vivo scan medium",
            options: {
              "Dry": "Dry",
              "Fluorinert": "Fluorinert",
              "Other": "Other"
            }
          }
        }
        return null
      }
    },
    exVivoScanningMediumOther: {
      kind: 'dynamic',
      deps: ['exVivoScanningMedium'],
      render(data) {
        if (data.exVivoScanningMedium === 'Other') {
          return {
            kind: "string",
            variant: "input",
            label: "Other ex-vivo scan medium:",
          }
        }
        return null
      }
    },
    anestheticUsed: {
     kind: "dynamic",
     deps: ['exVivoScan'],
     render(data){
       if(!data.exVivoScan && data.exVivoScan !== undefined){
        return {  
          kind: "boolean",
          variant: "radio",
          label: "Was anesthetic used?"
          }
     }
      return null
    }},
    dexUsed: {
      kind: "dynamic",
      deps: ["anestheticUsed"],
      render(data) {
        if (data.anestheticUsed) {
          return {
            kind: "boolean",
            variant: "radio",
            label: "Was Dexmedetomidine used?"
          }
        }
        return null
      }

    },

    dexSolutionCreationDate: {
      kind: "dynamic",
      deps: ['dexUsed'],
      render(data) {
        if (data.dexUsed) {
          return {
            kind: "date",
            label: "Dexmedetomidine solution creation date",
          }
        }
        return null
      }
    },

    dexBottleSerialCode: {
      kind: "dynamic",
      deps: ['dexUsed'],
      render(data) {
        if (data.dexUsed) {
          return {
            kind: "string",
            variant: "input",
            label: "Dexmedetomidine batch number",
          }
        }
        return null
      }
    },

    dexAdjustedFromSOP: {
      kind: "dynamic",
      deps: ['dexUsed'],
      render(data) {
        if (data.dexUsed) {
          return {
            kind: 'boolean',
            variant: "radio",
            label: "Dexmedetomidine adjusted from SOP?"
          }
        }
        return null
      }
    },

    dexAdjustedPercentage: {
      kind: "dynamic",
      deps: ['dexAdjustedFromSOP'],
      render(data) {
        if (data.dexAdjustedFromSOP) {
          return {
            kind: "string",
            variant: "input",
            label: "Dexmedetomidine percentage",
          }
        }
        return null
      }
    },

    isofluraneUsed: {
      kind: "dynamic",
      deps: ["anestheticUsed"],
      render(data) {
        if (data.anestheticUsed) {
          return {
            kind: "boolean",
            variant: "radio",
            label: "Isoflurane used?"
          }
        }
        return null
      }

    },

    isofluraneBottleSerialCode: {
      kind: "dynamic",
      deps: ['isofluraneUsed'],
      render(data) {
        if (data.isofluraneUsed) {
          return {
            kind: 'string',
            variant: "input",
            label: "Isoflurane bottle code"
          }
        }
        return null
      }
    },


    isofluraneAdjustedFromSOP: {
      kind: "dynamic",
      deps: ['isofluraneUsed'],
      render(data) {
        if (data.isofluraneUsed) {
          return {
            kind: 'boolean',
            variant: "radio",
            label: "Isoflurane adjusted from SOP?"
          }
        }
        return null
      }
    },

    isofluraneAdjustedPercentage: {
      kind: "dynamic",
      deps: ['isofluraneAdjustedFromSOP'],
      render(data) {
        if (data.isofluraneAdjustedFromSOP) {
          return {
            kind: "string",
            variant: "input",
            label: "Isoflurane percentage",
          }
        }
        return null
      }
    },

    fmriIsofluraneTracked: {
      kind: "dynamic",
      deps: ['isofluraneUsed'],
      render(data) {
        if(data.isofluraneUsed){
          return {
            kind: "boolean",
            variant: "radio",
            label: "fMRI isoflurane levels tracked?"
          }
        }
        return null
      }
      
    },

    fmriIsoflurane: {
      kind: "dynamic",
      deps: ['fmriIsofluraneTracked'],
      render(data) {
        if (data.fmriIsofluraneTracked) {
          return {
            kind: "number",
            variant: "slider",
            label: "fMRI Isoflurane percentage, consider this as the value before it is divided by 10, i.e. 15 = 1.5%",
            max: 15,
            min: 0
          }
        }
        return null
      }
    },
    fmriIsofluraneColour: {
      kind: "dynamic",
      deps: ['fmriIsoflurane'],
      render(data) {
        if (data.fmriIsoflurane === 2) {
          return {
            kind: "string",
            variant: "radio",
            label: "Isoflurane colour code",
            options: {
              "yellow": "Yellow",
              "green": "Green"
            }
          }
        }
        return null
      }
    },

    scanRecordInfo: {
      kind: "dynamic",
      deps: ["exVivoScan"],
      render({ exVivoScan }) {
        return {
          kind: "record-array",
          label: "MRI scan record",
          fieldset: {
            mriScanName: {
              kind: "string",
              variant: "select",
              label: "Scan name",
              options: scanNameOptions
            },

            mouseVitalsTracked: {
              kind: "dynamic",
              render(data) {
                if (!exVivoScan) {
                  return {
                    kind: "boolean",
                    variant: "radio",
                    label: "Were the animal's vitals tracked during scan (e.g. SP_O2, O_2 concentration, breathing, etc.)?"
                  }
                }
                return null
              }

            },
            breathingStable: {
              kind: 'dynamic',
              render(data) {
                if (data.mouseVitalsTracked) {
                  return {
                    kind: "boolean",
                    variant: "radio",
                    label: "Was breathing stable?"
                  }
                }
                return null
              }
            },

            oxygenConcentration: {
              kind: 'dynamic',
              render(data) {
                if (data.mouseVitalsTracked) {
                  return {
                    kind: "number",
                    variant: "input",
                    label: "Oxygen Concentration (0-100%)"
                  }
                }
                return null
              }
            },
            oxygenSaturation: {
              kind: 'dynamic',
              render(data) {
                if (data.mouseVitalsTracked) {
                  return {
                    kind: "number",
                    variant: "input",
                    label: "SP_O2 value (0-100%)"
                  }
                }
                return null
              }
            },
            respirationRate: {
              kind: 'dynamic',
              render(data) {
                if (data.mouseVitalsTracked) {
                  return {
                    kind: "number",
                    variant: "input",
                    label: "Respiration rate (breaths/min)"
                  }
                }
                return null
              }
            },

            formOfMeasurement: {
              kind: 'dynamic',
              render(data) {
                if (data.mouseVitalsTracked) {
                  return {
                    kind: "string",
                    variant: "select",
                    label: "How were Oxygen concentration, SP_O2, and respiration rate recorded?",
                    options: {
                      "Waveform": "Waveform",
                      "Numerical": "Numerical",
                      "Manual": "Manual"
                    }
                  }
                }
                return null
              }
            },

            
            otherComments: {
              kind: "string",
              variant: "textarea",
              label: "Please write any additional comments/notes here"
            }
          }
        }

      }
    },
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['Use this form for an individual mouse MRI sessions, which can contain multiple scans of different kinds. It is expected that the type of scan that are done on the mouse as well as certain information such as breath rate, and oxygenation level from the MRI monitor for certain scans. When recording the scans please put them in the exact order they were done within the session.'],

  },
  details: {
    description: "To record information about a mouse's MRI scan session. Keeps track of multiple scans within a single session. Can be filled in by either MRI operator or scan requester.",
    license: 'Apache-2.0',
    title: 'Mouse MRI Form'
  },
  measures: {
    mriOperatorName: {
      kind: "const",
      label: "MRI operator",
      visibility: "visible",
      ref: "mriOperatorName"
    },
    coilType: {
      kind: 'const',
      label: 'Coil type',
      visibility: "visible",
      ref: 'coilType'
    },
    paravisionVersion: {
      kind: 'const',
      label: 'Paravision Version',
      visibility: "visible",
      ref: 'paravisionVersion'
    },
    exVivoScan: {
      kind: "const",
      visibility: "visible",
      ref: "exVivoScan"
    },
    exVivoCranioStatus: {
      kind: "const",
      visibility: "visible",
      ref: "exVivoCranioStatus"
    },
    dexUsed: {
      kind: "const",
      visibility: "visible",
      ref: "dexUsed"
    },
    dexSolutionCreationDate: {
      kind: "const",
      visibility: "visible",
      ref: "dexSolutionCreationDate"
    },
    dexBottleSerialCode: {
      kind: "const",
      visibility: "visible",
      ref: "dexBottleSerialCode"
    },
    isofluraneUsed: {
      kind: "const",
      visibility: "visible",
      ref: "isofluraneUsed"
    },
    isofluraneBottleSerialCode: {
      kind: "const",
      visibility: "visible",
      ref: "isofluraneBottleSerialCode"
    },
    isofluraneAdjustedFromSOP: {
      kind: "const",
      visibility: "visible",
      ref: "isofluraneAdjustedFromSOP"
    },
    isofluraneAdjustedPercentage: {
      kind: "const",
      visibility: "visible",
      ref: "isofluraneAdjustedPercentage"
    },
    fmriIsofluraneTracked: {
      kind: "const",
      visibility: "visible",
      ref: "fmriIsofluraneTracked"
    },
    fmriIsoflurane: {
      kind: "const",
      visibility: "visible",
      ref: "fmriIsoflurane"
    },
    fmriIsofluraneColour: {
      kind: "const",
      visibility: "visible",
      ref: "fmriIsofluraneColour"
    },
    scanRecordInfo: {
      kind: "computed",
      label: "Scan record info",
      value: (data) => {
        const val = data.scanRecordInfo?.map((x) => x)
        let measureOutput = ''
        if (val) {
          for (const info of val) {
            measureOutput += info.mriScanName + ' ' + (info.breathingStable ? 'breathing stable: ' + info.breathingStable : '') + ' ' +
              (info.oxygenConcentration ? 'O_2 concentration: ' + info.oxygenConcentration + '%' : '') + ' ' + (info.oxygenSaturation ? 'O_2 saturation: ' + info.oxygenSaturation + '%' : '') +
              ' ' + (info.respirationRate ? 'respiration rate: ' + info.respirationRate + 'breath/min' : '') + ' ' + (info.formOfMeasurement ? 'form of measurement: ' + info.formOfMeasurement : '') +
              + (info.otherComments ? 'comments: ' + info.otherComments : '') + '\n';
          }
        }
        return measureOutput
      }
    }
  },
  validationSchema: z.object({
    mriOperatorName: z.string(),
    coilType: z.enum([
      "Cryocoil",
      "23 mm volumetric",
      "40 mm volumetric rat coil",
      "86 mm volumetric coil",
      "mouse surface coil",
      "4 coil array mouse surface coil",
      "10 mm loop coil",
      "30 mm loop coil"
    ]),
    paravisionVersion: z.enum(['PV5', 'PV6']),
    exVivoScan: z.boolean(),
    exVivoCranioStatus: z.enum(['In-cranio', 'Ex-cranio']).optional(),
    exVivoScanningMedium: z.enum(["Dry", "Fluorinert", "Other"]).optional(),
    exVivoScanningMediumOther: z.string().optional(),
    anestheticUsed: z.boolean(),
    dexUsed: z.boolean().optional(),
    dexSolutionCreationDate: z.date().optional(),
    dexBottleSerialCode: z.string().optional(),
    dexAdjustedFromSOP: z.boolean().optional(),
    dexAdjustedPercentage: z.string().optional(),
    isofluraneUsed: z.boolean().optional(),
    isofluraneBottleSerialCode: z.string().optional(),
    isofluraneAdjustedFromSOP: z.boolean().optional(),
    isofluraneAdjustedPercentage: z.string().optional(),
    fmriIsofluraneTracked: z.boolean().optional(),
    fmriIsoflurane: z.number().optional(),
    fmriIsofluraneColour: z.enum(['yellow', 'green']).optional(),
    scanRecordInfo: z.array(z.object({
      mriScanName: z.enum([
        "Localizer",
        "T1_FLASH_3D_100iso_10deg",
        "FLASH_3D_reduced",
        "ADJ_B0MAP",
        "revNoTrigAdjPEOffEPI",
        "B0 Map",
        "B1map_RARE_60deg_4s",
        "B1map_RARE_120deg_4s",
        "MGE_MTOff",
        "MGE_MTOn",
        "MGE_MTOff_Tw1_30deg",
        "T2star_FID_EPI_sat_dan_ver_original",
        "exvivoDanFLASH"
      ]),
      mouseVitalsTracked: z.boolean().optional(),
      breathingStable: z.boolean().optional(),
      oxygenConcentration: z.number().min(0).max(100).optional(),
      oxygenSaturation: z.number().min(0).max(100).optional(),
      respirationRate: z.number().min(0).max(350).optional(),
      formOfMeasurement: z.enum(['Waveform', 'Numerical', 'Manual']).optional(),
      otherComments: z.string().optional()

    })),
  })
});
