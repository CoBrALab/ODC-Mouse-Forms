/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

function createDependentField<T>(field: T, fn: (injectionType: string) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['injectionType'] as const,
    render: (data: { injectionType: string }) => {
      if (fn(data.injectionType)) {
        return field;
      }
      return null;
    }
  };
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Injections', 'Drug', 'Physical Intervention','Anesthesia'],
  internal: {
    edition: 1,
    name: 'MOUSE_INJECTIONS_FORM'
  },
  content: {
    injectionType: {
      kind: "string",
      variant: "radio",
      label: "Type of injection",
      options: {
        "Intracerebral": "Intracerebral",
        "IP":"IP",
        "Subcutaneous": "Subcutaneous"
      }
    }
  },
  details: {
    description: 'A form to describe a mouses injection information',
    estimatedDuration: 1,
    instructions: ['Please fill out this form whenever a mouse experiences an injection'],
    license: 'UNLICENSED',
    title: 'Injections Form'
  },
  measures: {},
  validationSchema: z.object({
    injectionType: z.string(),

  })
});
