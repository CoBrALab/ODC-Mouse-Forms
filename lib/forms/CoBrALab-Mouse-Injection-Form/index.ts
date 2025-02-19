/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

type InjectionType = "Subcutaneous" | "IP"

function createDependentField<const T>(field: T, fn: (injectionType: InjectionType) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['injectionType'] as const,
    render: (data: { injectionType: InjectionType }) => {
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
    edition: 3,
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
        "Subcutaneous": "Subcutaneous",
        "IP":"IP"
        
      },
    },
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
              "Carprofen": "Carprofen",
              "Bupivacaine": "Bupivacaine"
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
    },(type) => type === "IP"),

    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }

    
  },
  clientDetails: {
    estimatedDuration: 2,
    instructions: ['Please fill out this form whenever a mouse experiences an injection']
  },
  details: {
    description: 'A form to describe a mouses injection information',
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
    },
    additionalComments: {
      kind: "const",
      ref: "additionalComments"
    }

  },
  validationSchema: z.object({
    roomNumber: z.string(),
    injectionType: z.enum(["Subcutaneous","IP"]),
    hydrationProvided: z.boolean().optional(),
    hydrationVolume: z.number().min(0).optional(),
    subcutaneousInjectionType: z.enum(["Analgesic", "Other"]).optional(),
    subcutaneousInjectionTime: z.enum(["During operation", "Post operation"]).optional(),
    postOperationDay: z.date().optional(),
    analgesicType: z.enum(["Carprofen", "Bupivacaine"]).optional(),
    ipDoseVolume: z.number().min(0).optional(),
    drugInjected: z.enum(["PU-AD", "PU-AD Vehicle", "IP Tamoxifen", "STZ"]).optional(),
    ipInjectionType: z.enum(["Viral memetic", "Anesthetic"]).optional(),
    additionalComments: z.string().optional()
  })
});
