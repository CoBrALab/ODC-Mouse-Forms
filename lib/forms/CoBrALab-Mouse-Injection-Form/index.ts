/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

function createDependentField<const T>(field: T, fn: (injectionType: string) => boolean) {
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
        "Subcutaneous": "Subcutaneous",
        "IP":"IP"
        
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
            kind: "number",
            variant: "input",
            label: "Saline volume (ml)"
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

    subcutaneousInjectionTime: createDependentField({
      kind: 'string',
      variant: "select",
      label: "Time of injection",
      options: {
        "During operation": "During operation",
        "Post operation": "Post operation"
      }
    }, (type) => type === "Subcutaneous"),

    postOperationDay: {
      kind: "dynamic",
      deps: ["subcutaneousInjectionTime"],
      render(data) {
        if(data.subcutaneousInjectionTime === "Post operation"){
          return {
            kind: "date",
            label: "Post operation day"
          }
        }
        return null
      }
    },

    analgesicType: {
      kind: "dynamic",
      deps: ["subcutaneousInjectionType"],
      render(data) {
        if(data.subcutaneousInjectionType === "Analgesic"){
          return {
            kind: "string",
            variant: "select",
            label: "Analgesic type",
            options: {
              "Carpofem": "Carpofem",
              "Buvicane": "Buvicane"
            }
          }
        }
        return null
      }
    },

    ipDoseVolume: createDependentField({
      kind: "number",
      variant: "input",
      label: "IP dose volume (ml)"
    }, (type) => type === "IP"),

    drugInjected: createDependentField({
      kind: "string",
      variant: "select",
      label: "Drug injected",
      options: {
        "PU-AD":"PU-AD",
        "PU-AD Vehicle": "PU-AD Vehicle",
        "IP Tamoxifen": "IP Tamoxifen",
        "STZ": "STZ"
      }
    }, (type) => type === "IP"),

    ipInjectionType: createDependentField({
      kind: "string",
      variant: "select",
      label: "IP injection type",
      options: {
        "Viral memetic": "Viral memetic",
        "Anesthetic": "Anesthetic"
      }
    },(type) => type === "IP")

    
  },
  details: {
    description: 'A form to describe a mouses injection information',
    estimatedDuration: 1,
    instructions: ['Please fill out this form whenever a mouse experiences an injection'],
    license: 'Apache-2.0',
    title: 'Injections Form'
  },
  measures: {
    roomNumber: {
      kind: "const",
      ref: "roomNumber"
    },
    injectionType: {
      kind: "const",
      ref: "injectionType"
    },
    intracerebralInjectionType: {
      kind: "const",
      ref: "intracerebralInjectionType"
    },
    hydrationProvided: {
      kind: "const",
      ref: "hydrationProvided"
    },
    hydrationVolume: {
      kind: "const",
      ref: "hydrationVolume"
    },
    subcutaneousInjectionType: {
      kind: "const",
      ref: "subcutaneousInjectionType"
    },
    subcutaneousInjectionTime: {
      kind: "const",
      ref: "subcutaneousInjectionTime"
    },
    postOperationDay: {
      kind: "const",
      ref: "postOperationDay"
    },
    analgesicType: {
      kind: "const",
      ref: "analgesicType"
    },
    ipDoseVolume: {
      kind: "const",
      ref: "ipDoseVolume"
    },
    drugInjected: {
      kind: "const",
      ref: "drugInjected"
    },
    ipInjectionType: {
      kind: "const",
      ref: "ipInjectionType"
    }

  },
  validationSchema: z.object({
    roomNumber: z.string(),
    injectionType: z.string(),
    intracerebralInjectionType: z.string().optional(),
    hydrationProvided: z.boolean().optional(),
    hydrationVolume: z.number().min(0).optional(),
    subcutaneousInjectionType: z.string().optional(),
    subcutaneousInjectionTime: z.string().optional(),
    postOperationDay: z.date().optional(),
    analgesicType: z.string().optional(),
    ipDoseVolume: z.number().min(0).optional(),
    drugInjected: z.string().optional(),
    ipInjectionType: z.string().optional()
  })
});
