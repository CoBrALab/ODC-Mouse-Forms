/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

function createDependentField<T>(field: T, fn: (treatmentType: string) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['treatmentType'] as const,
    render: (data: { treatmentType: string }) => {
      if (fn(data.treatmentType)) {
        return field;
      }
      return null;
    }
  };
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Surgery', 'Vet Care', 'Wound Treatment', 'Ovariectomy'],
  internal: {
    edition: 1,
    name: 'MOUSE_SURGERY_FORM'
  },
  content: {
    treatmentType: {
      kind: "string",
      variant: "select",
      label: "Select physical intervention",
      options: {
        "Surgery": "Surgery",
        "Wound Treatment": "Wound Treatment"
      }
    },
    analglesiaUsed: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Analglesia used"
    }, (type) => type === "Surgery")
  },
  details: {
    description: 'Form to be filled in when a mouse goes through a surgery or veterinary care',
    estimatedDuration: 1,
    instructions: ['Please fill this form whenever a mouse has to through a surgery or has gone through veterinary care'],
    license: 'UNLICENSED',
    title: 'Mouse surgery, wound treatment and veterinary care form'
  },
  measures: {},
  validationSchema: z.object({
    treatmentType: z.string(),
    analglesiaUsed: z.boolean().optional()
  })
});
