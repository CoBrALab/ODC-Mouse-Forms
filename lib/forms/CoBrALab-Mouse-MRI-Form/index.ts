/* eslint-disable perfectionist/sort-objects */

import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core'
import { z } from '/runtime/v1/zod@3.23.x'


const scanNameOptions = {
  "Localizer": "Localizer",
  "T1_FLASH_3D_100iso_10deg":"T1_FLASH_3D_100iso_10deg",
  "FLASH_3D_reduced":"FLASH_3D_reduced",
  "ADJ_B0MAP":"ADJ_B0MAP",
  "revNoTrigAdjPEOffEPI":"revNoTrigAdjPEOffEPI",
  "B0 Map":"B0 Map",
  "B1map_RARE_60deg_4s":"B1map_RARE_60deg_4s",
  "B1map_RARE_120deg_4s":"B1map_RARE_120deg_4s",
  "MGE_MTOff":"MGE_MTOff",
  "MGE_MTOn":"MGE_MTOn",
  "MGE_MTOff_Tw1_30deg":"MGE_MTOff_Tw1_30deg",
  "T2star_FID_EPI_sat_dan_ver_original":"T2star_FID_EPI_sat_dan_ver_original",
  "exvivoDanFLASH":"exvivoDanFLASH"

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
            "23 mm volumetric": "23 mm volumetric",
            "40 mm volumetric rat coil":"40 mm volumetric rat coil",
            "86 mm volumetric coil":"86 mm volumetric coil",
            "mouse surface coil":"mouse surface coil",
            "4 coil array mouse surface coil":"4 coil array mouse surface coil",
            "10 mm loop coil":"10 mm loop coil",
            "30 mm loop coil":"30 mm loop coil"

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

    exVivoScan: {
      kind: "boolean",
      variant: "radio",
      label: "Was scan done on ex-vivo subject?"
    },
    exVivoCranioStatus: {
      kind: 'dynamic',
      deps: ['exVivoScan'],
      render(data) {
        if(data.exVivoScan){
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

    exVivoScanningMedium: {
      kind: 'dynamic',
      deps: ['exVivoScan'],
      render(data) {
        if(data.exVivoScan){
          return {
            kind: "string",
            variant: "radio",
            label: "Ex-vivo scan medium",
            options: {
                "Dry":"Dry",
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
        if(data.exVivoScanningMedium === 'Other'){
          return {
            kind: "string",
            variant: "input",
            label: "Other ex-vivo scan medium:",
          }
        }
        return null
      }
    },
    dexUsed: {
          kind: "boolean",
          variant: "radio",
          label: "Was Dexmedetomidine used?"
        },

    dexSolutionDate: {
          kind: "dynamic",
          deps: ['dexUsed'],
          render(data) {
            if(data.dexUsed){
              return {
                kind: "date",
                label: "Dexmedetomidine Solution date",
              }
            }
            return null
          }
        },

        dexBatchNumber:  {
          kind: "dynamic",
          deps: ['dexUsed'],
          render(data) {
            if(data.dexUsed){
              return {
                kind: "string",
                variant: "input",
                label: "Dexmedetomidine batch number",
              }
            }
            return null
          }
        },
          
      isofluoraneUsed: {
        kind: "boolean",
        variant : "radio",
        label: "Isofluorane used?"
      } ,
        
      isofluoraneBatchNumber: {
        kind: "dynamic",
        deps: ['isofluoraneUsed'],
        render(data){
          if(data.isofluoraneUsed){
            return {
               kind: 'string',
              variant: "input",
              label: "Isofluorane batch number"
            }
          }
          return null
        }
      },
      
      
      isofluoraneAdjusted: {
         kind: "dynamic",
         deps: ['isofluoraneUsed'],
        render(data){
          if(data.isofluoraneUsed){
            return {
                kind: 'boolean',
                variant: "radio",
                label: "Isofluorane adjusted from SOP?"
            }
          }
          return null
        }
      },

      isofluoraneAdjustedPercentage: {
        kind: "dynamic",
        deps: ['isofluoraneAdjusted'],
        render(data) {
          if(data.isofluoraneAdjusted){
            return {
              kind: "string",
              variant: "input",
              label: "Isofluorane percentage",
            }
          }
          return null
        }
      },

    scanRecordInfo: {
      kind: "dynamic",
      deps: ["exVivoScan"],
      render({exVivoScan}){
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
          if(!exVivoScan){
            return {
              kind: "boolean",
              variant: "radio",
              label:"Were the animal's vitals tracked during scan (e.g. SP_O2, O_2 concentration, breathing, etc.)?"
            }
          }
          return null
        }
       
      }, 
      breathingStable: {
        kind: 'dynamic',
        render(data) {
          if(data.mouseVitalsTracked){
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
          if(data.mouseVitalsTracked){
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
          if(data.mouseVitalsTracked){
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
          if(data.mouseVitalsTracked){
            return {
                kind: "number",
                variant: "input",
                label: "Respiration rate (breaths/min)"
            }
          }
          return null
        }
      },

      formOfMeasurement:  {
        kind: 'dynamic',
        render(data) {
          if(data.mouseVitalsTracked){
            return {
                  kind: "string",
                  variant: "select",
                  label: "How were Oxygen concentration, SP_O2, and respiration rate recorded?",
                  options: {
                    "Waveform": "Waveform",
                    "Numerical": "Numerical",
                    "Manual":"Manual"
                  }
            }
          }
          return null
        }
      },
      
      fmriIsofluoraneTracked: {
        kind: "boolean",
        variant: "radio",
        label: "fMRI isofluorane levels tracked?"
      },
      
      fmriIsofluorane: {
        kind: "dynamic",
        render(data){
          if(data.fmriIsofluoraneTracked){
            return {
              kind: "number",
              variant: "slider",
              label: "fMRI Isofluorane percentage, consider this as the value before it is divised by 10, i.e. 15 = 1.5%",
              max: 15,
              min: 0
            }
          }
          return null
        }
      },
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
    exVivoScan: {
      kind: "const",
      ref: "exVivoScan"
    },
    exVivoCranioStatus: {
      kind: "const",
      ref: "exVivoCranioStatus"
    },
    scanRecordInfo: {
      kind: "computed",
      label: "Scan record info",
      value: (data) => {
        const val = data.scanRecordInfo?.map((x) => x)
        let measureOutput = ''
        if(val){
          for (const info of val) {
            measureOutput += info.mriScanName  + ' ' + (info.dexSolutionDate ? 'dex solution date: ' + info.dexSolutionDate:'')  + ' ' + (info.dexBatchNumber ? 'dex batch number: ' + info.dexBatchNumber:'') +
            ' ' + (info.isofluoraneBatchNumber ? 'isofluorane batch number: ' + info.isofluoraneBatchNumber:'') + ' ' + (info.isofluoraneAdjustedPercentage ? 'Isofluorane adjusted percentage: ' + 
            info.isofluoraneAdjustedPercentage + '%':'') + ' ' + (info.breathingStable ? 'breathing stable: ' + info.breathingStable: '') + ' ' +
            (info.oxygenConcentration ? 'O_2 concentration: ' + info.oxygenConcentration + '%' : '') + ' ' + (info.oxygenSaturation ? 'O_2 saturation: ' + info.oxygenSaturation + '%' : '') +
            ' ' + (info.respirationRate ? 'respiration rate: ' + info.respirationRate + 'breath/min' : '' ) + ' ' + (info.formOfMeasurement ? 'form of measurement: ' + info.formOfMeasurement: '') +
            ' ' + (info.fmriIsofluorane ? 'fMRI isofluorane percentage: ' + (info.fmriIsofluorane / 10) + '%': '') + ' ' + (info.fmriIsofluoraneColour ? 'fMRI isofluorane colour: ' + info.fmriIsofluoraneColour: '') + 
            ' ' + (info.otherComments ? 'comments: ' + info.otherComments: '') + '\n';
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
    exVivoScanningMedium:  z.enum(["Dry","Fluorinert","Other"]).optional(),
    exVivoScanningMediumOther: z.string().optional(),
    dexUsed: z.boolean(),
    dexSolutionDate: z.date().optional(),
    dexBatchNumber: z.string().optional(),
    isofluoraneUsed: z.boolean(),
    isofluoraneBatchNumber: z.string().optional(),
    isofluoraneAdjusted: z.boolean().optional(),
    isofluoraneAdjustedPercentage: z.string().optional(),
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
      fmriIsofluoraneTracked: z.boolean(),
      fmriIsofluorane: z.number().optional(),
      fmriIsofluoraneColour: z.enum(['yellow', 'green']).optional(),
      otherComments: z.string().optional()

    })),
  })
});