/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

function createDependentField<const T>(field: T, fn: (interventionType: string) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['interventionType'] as const,
    render: (data: { interventionType: string }) => {
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
    edition: 1,
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
    }, (type) => type === "Blood glucose")
  },
  details: {
    description: '<PLACEHOLDER>',
    estimatedDuration: 1,
    instructions: ['<PLACEHOLDER>'],
    license: 'UNLICENSED',
    title: 'Physical Intervention Form'
  },
  measures: {
    interventionType: {
      kind: "const",
      ref: "interventionType"
    },
    nameOfVaginalSwabber: {
      kind: "const",
      ref: "nameOfVaginalSwabber"
    },
    vaginalSwabNumber: {
      kind: "const",
      ref: "vaginalSwabNumber"
    },
    vaginalCytologyDuration: {
      kind: "const",
      ref: "vaginalCytologyDuration"
    },
    vaginalCytologySolutionVolume: {
      kind: "const",
      ref: "vaginalCytologySolutionVolume"
    },
    genotypeBodyPartUsed: {
      kind: "const",
      ref: "genotypeBodyPartUsed"
    },
    genotypeCompanyUsed: {
      kind: "const",
      ref: "genotypeCompanyUsed"
    },
    genotypeCopy: {
      kind: "const",
      ref: "genotypeCopy"
    },
    earTaggingSystem: {
      kind: "const",
      ref: "earTaggingSystem"
    },
    tattooLocationInfo: {
      kind: "computed",
      label: "Tattoo Locations",
      value: (data) => {
        const val = data.tattooLocationInfo?.map((x) => x)
        let tattooText = ""
        if(val){
          for (const info of val){
            tattooText += info.tattooLocation + " "
          }
          return tattooText
        }
        return undefined
      }
    },
    teethExtractionNumber: {
      kind: "const",
      ref: "teethExtractionNumber"
    },
    bloodGlucoseLevel: {
      kind: "const",
      ref: "bloodGlucoseLevel"
    }
  },
  validationSchema: z.object({
    interventionType: z.string(),
    nameOfVaginalSwabber: z.string().optional(),
    vaginalSwabNumber: z.number().min(1).int().optional(),
    vaginalCytologyDuration: z.number().min(1).optional(),
    vaginalCytologySolutionVolume: z.number().min(0).optional(),
    genotypeBodyPartUsed: z.string().optional(),
    genotypeCompanyUsed: z.string().optional(),
    genotypeCopy: z.string().optional(),
    earTaggingSystem: z.string().optional(),
    tattooLocationInfo: z.array(z.object({ tattooLocation: z.string().optional()}
    )).optional(),
    teethExtractionNumber: z.number().int().min(0).max(16).optional(),
    bloodGlucoseLevel: z.string().optional()
  })
});