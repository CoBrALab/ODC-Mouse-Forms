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
    roomNumber: {
      kind: "string",
      variant: "input",
      label: "Room number"
    },
    injectionType: {
      kind: "string",
      variant: "radio",
      label: "Type of injection",
      options: {
        "Intracerebral": "Intracerebral",
        "IP":"IP",
        "Subcutaneous": "Subcutaneous"
      },
    },
    intracerebralInjectionType: createDependentField({
        kind: "string",
        variant: "select",
        label: "Intracerebral injection type",
        options: {
          "PBS": "PBS",
          "PFF": "PFF"
        }
      }, (type) => type === 'Intracerebral'),
    hydrationProvided: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Hydration provided (saline)?"

    },(type) => type === 'Intracerebral'),
    hydrationVolume: {
      kind: "dynamic",
      deps: ["hydrationProvided"],
      render(data) {
        if(data.hydrationProvided){
          return {
            kind: "string",
            variant: "input",
            label: "Saline volume"
          }
        }
        return null
      }
    },
    subcutaneousInjectionType: createDependentField({
      kind: "string",
      variant: "select",
      label: "Subcutaneous injection type",
      options: {
        "Analgesic": "Analgesic",
        "Other": "Other"
      }
    },(type) => type === "Subcutaneous"),

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
    roomNumber: z.string(),
    injectionType: z.string(),
    intracerebralInjectionType: z.string().optional(),
    hydrationProvided: z.boolean().optional(),
    hydrationVolume: z.string().optional(),
    subcutaneousInjectionType: z.string().optional()

  })
});
