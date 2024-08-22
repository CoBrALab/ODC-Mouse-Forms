/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

function createDependentField<T>(field: T, fn: (interventionType: string) => boolean) {
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
      label: "Type of physicial intervention",
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
    vaginalSwabber: createDependentField({
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
    }, (type) => type === 'Vaginal cytology')
  },
  details: {
    description: '<PLACEHOLDER>',
    estimatedDuration: 1,
    instructions: ['<PLACEHOLDER>'],
    license: 'UNLICENSED',
    title: 'Physical Intervention Form'
  },
  measures: {},
  validationSchema: z.object({
    interventionType: z.string(),
    vaginalSwabber: z.string().optional(),
    vaginalSwabNumber: z.number().min(1).int().optional(),
    vaginalCytologyDuration: z.number().min(1).optional(),
    vaginalCytologySolutionVolume: z.number().min(0).optional()
  })
});
