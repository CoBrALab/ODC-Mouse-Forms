/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Serums', 'Histology','Brain Slicing', 'Immunohistochemistry', 'Immunofluorescense'],
  internal: {
    edition: 1,
    name: 'HISTOLOGY_FORM'
  },
  content: {
    roomNumber: {
      kind: "string",
      variant: "input",
      label: "Room number"
    },
    histologyType: {
      kind: "string",
      variant: "select",
      label: "Type of Histology used",
      options: {
        "Immunohistochemistry": "Immunohistochemistry",
        "Immunofluorescense": "Immunofluorescense"
      }
    },
    brainStorageConditions: {
      kind: "string",
      variant: "select",
      label: "Type of storage brain was kept in",
      options: {
        "Parrafin": "Parrafin",
        "Frozen": "Frozen"
      }
    },
    wasBrainSliced: {
      kind: "boolean",
      variant: "radio",
      label: "Was brain sliced?"
    },
    brainSliceWidth: {
      kind: "dynamic",
      deps: ["wasBrainSliced"],
      render(data) {
        if(data.wasBrainSliced){
          return {
            kind: "number",
            variant: "input",
            label: "Width of slices (mm)"
          }
        }
        return null
      }
    },
    portionOfBrainSliced: {
      kind: "dynamic",
      deps: ["wasBrainSliced"],
      render(data) {
        if(data.wasBrainSliced){
          return {
            kind: "string",
            variant: "select",
            label: "Portion of brain used",
            options: {
              "Whole brain": "Whole brain",
              "Half brain": "Half brain"
            }
          }
        }
        return null
      }
    },
    protocolFollowed: {
      kind: "string",
      variant: "select",
      label: "Protocol followed",
      options: {
        "CoBrA Lab": "CoBrA Lab",
        "Other": "Other"
      }
    },
    antibodiesUsedInfo: {
      kind: "record-array",
      label: "Antibody Info",
      fieldset: {
        antibodyType: {
          kind: "string",
          variant: "radio",
          label: "Type of Antibody",
          options: {
            "Primary": "Primary",
            "Secondary": "Secondary"
          }
        },
        antibodyName: {
          kind: "string",
          variant: "input",
          label: "Name of Antibody"
        },
        antibodyConcentration: {
          kind: "number",
          variant: "input",
          label: "Antibody Concentration μg/mL"
        }
      }
    },
    serumUsed: {
      kind: "string",
      variant: "select",
      label: "Kind of serum used",
      options: {
        "Donkey serum": "Donkey serum",
        "Goat serum": "Goat serum",
        "Chicken serum": "Chicken serum",
        "Mice serum": "Mice serum"
      }
    },
    batchNumber: {
      kind: "string",
      variant: "input",
      label: "Batch number"
    },
    wasSampleStained: {
      kind: "boolean",
      variant: "radio",
      label: "Was sample stained"
    },
    stainUsed: {
      kind: "dynamic",
      deps: ['wasSampleStained'],
      render(data){
        if(data.wasSampleStained){
          return {
              kind: "string",
              variant: 'select',
              label: "Stain used",
              options: {
                "GFAP":"GFAP",
                "IBA1":"IBA1",
                "PSYN":"PSYN",
                "TH":"TH",
                "NEUN":"NEUN"
              }
          }
        }
        return null
      }
    },
    dateStained: {
      kind: "dynamic",
      deps: ['wasSampleStained'],
      render(data){
        if(data.wasSampleStained){
          return {
              kind: "date",
              label: "Date sample was stained",
              
          }
        }
        return null
      }
    },

    histologyQuantified: {
      kind: "boolean",
      variant: "radio",
      label:"Histology Quantified" 
    }
    
    
  },
  details: {
    description: 'Describes when a section of an animal goes through a histology process. The processes listed in this form are Immunofluorescense and Immunohistochemistry. These are done with Ex-vivo samples usually consting of slices of the brain.',
    estimatedDuration: 1,
    instructions: ['Please fill out this form whenever a Immunofluorescense or Immunohistochemistry task is done upon samples of an animal subject. In order to fill out the form the user must know which antibodies were used, if the sample was stained and if so the stain date, and how much brain tissue they used.'],
    license: 'Apache-2.0',
    title: 'Histology Form'
  },
  measures: {},
  validationSchema: z.object({
    roomNumber: z.string(),
    histologyType: z.string(),
    brainStorageConditions: z.string(),
    wasBrainSliced: z.boolean(),
    brainSliceWidth: z.number().optional(),
    portionOfBrainSliced: z.string().optional(),
    protocolFollowed: z.string(),
    antibodiesUsedInfo: z.array(z.object({
      antibodyType: z.string(),
      antibodyName: z.string(),
      antibodyConcentration: z.number()
    })),
    serumUsed: z.string(),
    batchNumber: z.string(),
    wasSampleStained: z.boolean(),
    stainUsed: z.string().optional(),
    dateStained: z.date().optional(),
    histologyQuantified: z.boolean()
    
  })
});
