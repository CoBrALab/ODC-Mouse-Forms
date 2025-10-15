/* eslint-disable perfectionist/sort-objects */

import { z }from '/runtime/v1/zod@3.23.x/index.js';
import { defineInstrument } from '/runtime/v1/@opendatacapture/runtime-core';

const interventionTypeList = [ "Blood extraction",
    "Teeth extraction",
    "Ear tagging",
    "Tattooing",
    "Vaginal cytology",
    "Genotyping",
    "Blood glucose",
    "Anesthesia"] as const

type InterventionType = typeof interventionTypeList[number];

function createDependentField<const T>(field: T, fn: (interventionType?: InterventionType) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['interventionType'] as const,
    render: (data: { interventionType?: InterventionType }) => {
      if (fn(data.interventionType)) {
        return field;
      }
      return null;
    }
  };
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Physical intervention','Blood extraction', 'Ear tagging', 'Genotyping', 'Vaginal cytology','Blood glucose','anesthesia'],
  internal: {
    edition: 3,
    name: 'PHYSICAL_INTERVENTION_FORM'
  },
  content: {
    interventionType: {
      kind: "string",
      variant: "select",
      label: "Type of physical intervention",
      options: {
        "Blood extraction": "Blood extraction",
        "Teeth extraction": "Teeth extraction",
        "Ear tagging": "Ear tagging",
        "Tattooing": "Tattooing",
        "Vaginal cytology": "Vaginal cytology",
        "Genotyping": "Genotyping",
        "Blood glucose": "Blood glucose",
        "Anesthesia": "Anesthesia"
      }
    },
    nameOfVaginalSwabber: createDependentField({
      kind: "string",
      variant: 'input',
      label: "Person swabbing"
    }, (type) => type === 'Vaginal cytology'),

    vaginalSwabNumber: createDependentField({
      kind: 'number',
      variant: "input",
      label: "Number of times swabbed"
    }, (type) => type === 'Vaginal cytology'),

    vaginalCytologyDuration: createDependentField({
      kind: "number",
      variant: "input",
      label: "Vaginal cytology duration (in seconds)"
    }, (type) => type === 'Vaginal cytology'),

    vaginalCytologySolutionVolume: createDependentField({
      kind: "number",
      variant: "input",
      label: "Cytology solution volume (ml)"
    }, (type) => type === 'Vaginal cytology'),

    genotypeBodyPartUsed: createDependentField({
      kind: "string",
      variant: "select",
      label: "Part of animal used for genotyping",
      options: {
        "Tail":"Tail",
        "Ear":"Ear",
        "Fecal matter": "Fecal matter"
      }
    }, (type) => type === "Genotyping"),
    genotypeCompanyUsed: createDependentField({
      kind: "string",
      variant: "select",
      label: "Company used",
      options: {
        "Transnetyx": "Transnetyx",
        "Other": "Other"
      }
    }, (type) => type === "Genotyping"),
    genotypeCopy: createDependentField({
      kind: "string",
      variant: "select",
      label: "Genotype copy (if available)",
      options: {
        "Homozygous": "Homozygous",
        "Heterozygous": "Heterozygous",
        "Null": "Null",
        "Other": "Other"
      }
    },
    (type) => type === "Genotyping"),
    earTaggingSystem: createDependentField({
      kind: "string",
      variant: "select",
      label: "Ear tagging system",
      options: {
        "1-99 System": "1-99 System",
        "1-32 System": "1-32 System",
        "Other": "Other"
      }
    },
    (type) => type === "Ear tagging"),
    tattooLocationInfo: createDependentField({
      kind: "record-array",
      label: "Tattooing information",
      fieldset: {
        tattooLocation: {
          kind: "string",
          variant: "select",
          label: "Tattoo location",
          options: {
            "Upper left": "Upper left",
            "Upper right": "Upper right",
            "Lower left": "Lower left",
            "Lower right": "Lower right"
          }
        }
      }
    },
    (type) => type === "Tattooing"),
    teethExtractionNumber: createDependentField({
      kind: "number",
      variant: "input",
      label: "Number of teeth extracted"
    }, (type) => type === "Teeth extraction"),
    bloodGlucoseLevel: createDependentField({
      kind: "string",
      variant: 'input',
      label: "Blood glucose level"
    }, (type) => type === "Blood glucose"),

    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }
  },
  details: {
    description: 'This form is used to track any physical intervention done upon an animal. Possible physical interventions include teeth extraction, tagging, tattooing, cytologies and other forms of swabbing.',
    license: 'Apache-2.0',
    title: 'Physical Intervention Form'
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['Whenever an physical intervention is done please fill out this form to describe the type of intervention and its details. One must keep track of the certain parts of the animal that were affected by the intervention or if any parts were extracted.']
  },
  measures: {
    interventionType: {
      kind: "const",
      visibility: "visible",
      ref: "interventionType"
    },
    nameOfVaginalSwabber: {
      kind: "const",
      visibility: "visible",
      ref: "nameOfVaginalSwabber"
    },
    vaginalSwabNumber: {
      kind: "const",
      visibility: "visible",
      ref: "vaginalSwabNumber"
    },
    vaginalCytologyDuration: {
      kind: "const",
      visibility: "visible",
      ref: "vaginalCytologyDuration"
    },
    vaginalCytologySolutionVolume: {
      kind: "const",
      visibility: "visible",
      ref: "vaginalCytologySolutionVolume"
    },
    genotypeBodyPartUsed: {
      kind: "const",
      visibility: "visible",
      ref: "genotypeBodyPartUsed"
    },
    genotypeCompanyUsed: {
      kind: "const",
      visibility: "visible",
      ref: "genotypeCompanyUsed"
    },
    genotypeCopy: {
      kind: "const",
      visibility: "visible",
      ref: "genotypeCopy"
    },
    earTaggingSystem: {
      kind: "const",
      visibility: "visible",
      ref: "earTaggingSystem"
    },
    tattooLocationInfo: {
      kind: "computed",
      label: "Tattoo Locations",
      visibility: "visible",
      value: (data) => {
        const val = data.tattooLocationInfo || []
        const tattooResults = val.map(tattoo => ({
          "Tattoo Location": tattoo.tattooLocation
        }))
        return tattooResults
      }
    },
    teethExtractionNumber: {
      kind: "const",
      visibility: "visible",
      ref: "teethExtractionNumber"
    },
    bloodGlucoseLevel: {
      kind: "const",
      visibility: "visible",
      ref: "bloodGlucoseLevel"
    },
    additionalComments: {
      kind: 'const',
      visibility: "visible",
      ref: 'additionalComments'
    }
  },
  validationSchema: z.object({
  interventionType: z.enum([
    "Blood extraction",
    "Teeth extraction",
    "Ear tagging",
    "Tattooing",
    "Vaginal cytology",
    "Genotyping",
    "Blood glucose",
    "Anesthesia"
  ]),
    nameOfVaginalSwabber: z.string().optional(),
    vaginalSwabNumber: z.number().min(1).int().optional(),
    vaginalCytologyDuration: z.number().min(1).optional(),
    vaginalCytologySolutionVolume: z.number().min(0).optional(),
     genotypeBodyPartUsed: z.enum([
    "Tail",
    "Ear",
    "Fecal matter"
  ]).optional(),
  genotypeCompanyUsed: z.enum([
    "Transnetyx",
    "Other"
  ]).optional(),
  genotypeCopy: z.enum([
    "Homozygous",
    "Heterozygous",
    "Null",
    "Other"
  ]).optional(),
  earTaggingSystem: z.enum([
    "1-99 System",
    "1-32 System",
    "Other"
  ]).optional(),
  tattooLocationInfo: z.array(z.object({
    tattooLocation: z.enum([
      "Upper left",
      "Upper right",
      "Lower left",
      "Lower right"
    ]).optional()
  })).optional(),
    teethExtractionNumber: z.number().int().min(0).max(16).optional(),
    bloodGlucoseLevel: z.string().optional(),
    additionalComments: z.string().optional()
  })
});
