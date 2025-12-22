/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mating', 'Mouse','Origin','Plug'],
  internal: {
    edition: 1,
    name: 'MOUSE_MATING_FORM'
  },
  content: {
     breedingCageId: {
      kind: 'string',
      variant: 'input',
      label: "Mating Cage ID" 
    },
    roomNumber: { 
      kind: "string",
      variant: "input",
      label: "Room number mating session took place in"
    },
    partnerMouse: {
      kind: "string",
      variant: "input",
      label: "Id of mouse's mating partner"
    },
    partnerSex: {
      kind: "string",
      variant: "select",
      label: "Mating partner's sex",
      options: {
        "Male": "Male",
        "Female": "Female"
      }
    },
    partnerMouseStrain: {
    
      kind: 'string',
      variant: 'select',
      label: 'Mating partner mouse strain (optional)',
      options: {
        "M83": "M83",
        "C57BL/6J": "C57BL/6J",
        "5XFAD": "5XFAD",
        "3xTG-AD": "3xTG-AD",
        "Other":"Other"
      }
    },
    partnerMouseOtherStrain: {
      kind: "dynamic",
      deps: ["partnerMouseStrain"],
      render(data) {
        if(data.partnerMouseStrain === "Other"){
           return {
            kind : "string",
            variant: "input",
            label: "Mating partner other strain"
           }
        }
        return null
      }
    },

    partnerMouseGenotype: {
      kind: "string",
      variant: "select",
      label: "Mating partner mouse Genotype (optional)",
      options: {
        "Hemizygous": "Hemizygous",
        "Homozygous": "Homozygous",
        "Heterozygous": "Heterozygous",
        "Wild-type": "Wild-type",
        "Other": "Other"
      }
    },
    partnerMouseGenotypeOther: {
      kind: "dynamic",
      deps: ["partnerMouseGenotype"],
      render(data) {
        if(data.partnerMouseGenotype === "Other"){
           return {
            kind : "string",
            variant: "input",
            label: "Other Genotype"
           }
        }
        return null
      }
    },
    reasonForMating: {
      kind: "string",
      variant: "input",
      label: "Reason for Mating"
    },
    numberOfMice: {
      kind: "number",
      variant: "input",
      label: "Total number of mice in mating cage"
    },
    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['Tracking the events of a mouse that took part in a mating session. The room as well as the cage ID should be known to fill out the form']
  },
  details: {
    description: 'Tracks information of a mouses mating form',
    license: 'Apache-2.0',
    title: 'Mouse Mating Form'
  },
  measures: {
   
    breedingCageId: {
      kind: "const",
      visibility: 'visible',
      ref: 'breedingCageId'
    },
    partnerMouse: {
      kind: 'const',
      visibility: 'visible',
      ref: 'partnerMouse'
    },
     partnerSex: {
      kind: 'const',
      visibility: 'visible',
      ref: 'partnerSex'
    },
    partnerMouseStrain: {
      kind: 'const',
      visibility: 'visible',
      ref: 'partnerMouseStrain'
    },
    partnerMouseOtherStrain: {
      kind: 'const',
      visibility: 'visible',
      ref: 'partnerMouseOtherStrain'
    },
    partnerMouseGenotype: {
      kind: 'const',
      visibility: 'visible',
      ref: 'partnerMouseGenotype'
    },
    partnerMouseGenotypeOther: {
      kind: 'const',
      visibility: 'visible',
      ref: 'partnerMouseGenotypeOther'
    },
    numberOfMice: {
      kind: "const",
      visibility: 'visible',
      ref: "numberOfMice"
    },
     roomNumber: {
      kind: 'const',
      visibility: 'visible',
      ref: 'roomNumber'
    },
    reasonForMating: {
      kind: 'const',
      visibility: 'visible',
      ref: 'reasonForMating'
    },
    additionalComments: {
      kind: 'const',
      visibility: 'visible',
      ref: 'additionalComments'
    }
  },
  validationSchema: z.object({
  breedingCageId: z.string(),
  partnerMouse: z.string(),
  partnerSex: z.enum(['Male','Female']),
  partnerMouseStrain: z.enum([
    'M83',
    'C57BL/6J',
    '5XFAD',
    '3xTG-AD',
    'Other'
  ]).optional(),
  partnerMouseOtherStrain: z.string().optional(),
  partnerMouseGenotype: z.enum([
    'Homozygous',
    'Hemizygous',
    'Heterozygous',
    'Wild-type',
    'Other'
  ]).optional(),
  partnerMouseGenotypeOther: z.string().optional(),
  roomNumber: z.string(),
  numberOfMice: z.number().int().min(0),
  reasonForMating: z.string(),
  additionalComments: z.string().optional()
})
});