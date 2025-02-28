/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

type InjectionType = "Subcutaneous" | "IP"

function createDependentField<const T>(field: T, fn: (injectionType?: InjectionType) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['injectionType'] as const,
    render: (data: { injectionType?: InjectionType }) => {
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
    subcutaneousInjectionType: createDependentField({
      kind: "string",
      variant: "select",
      label: "Subcutaneous injection type",
      options: {
        "Analgesic": "Analgesic",
        "Other": "Other"
      }
    },(type) => type === "Subcutaneous"),

    subcutaneousInjectionTypeOther: {
      kind: "dynamic",
      deps: ['subcutaneousInjectionType'],
      render(data){
        if(data.subcutaneousInjectionType === "Other"){
          return {
            kind: "string",
            variant: "input",
            label: "Other subcutaneous injection type"
          }
        }
        return null
      }
      
    },

    subcutaneousInjectionPostOperation: createDependentField({
      kind: 'boolean',
      variant: 'radio',
      label: "Was the subcutaneous injection for post-operation recovery?"
    }, (type) => type === "Subcutaneous"),

    postOperationDay: {
      kind: "dynamic",
      deps: ["subcutaneousInjectionPostOperation"],
      render(data) {
        if(data.subcutaneousInjectionPostOperation){
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

    ipInoculumAdministered: createDependentField({
      kind: "string",
      variant: "select",
      label: "IP inoculum administered",
      options: {
        "PU-AD":"PU-AD",
        "PU-AD Vehicle": "PU-AD Vehicle",
        "IP Tamoxifen": "IP Tamoxifen",
        "STZ": "STZ",
        "Dexmedetomidine":"Dexmedetomidine"
      }
    }, (type) => type === "IP"),

    ipInoculumBatchNumber: createDependentField({
      kind: "string",
      variant: "input",
      label: "IP inoculum batch number",
    }, (type) => type === "IP"),

    ipInjectionPurpose: createDependentField({
      kind: "string",
      variant: "select",
      label: "Purpose of IP injection",
      options: {
        "Viral memetic": "Viral memetic",
        "Anesthetic": "Anesthetic",
        "Intervention": "Intervention",
        "Drug treatment": "Drug treatment",
        "Other": "Other"
      }
    },(type) => type === "IP"),

    ipInjectionPurposeOther: {
      kind: "dynamic",
      deps: ["ipInjectionPurpose"],
      render(data){
        if(data.ipInjectionPurpose === "Other"){
           return {
            kind: "string",
            variant: "textarea",
            label: "Other purpose for IP injection"
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
      visibility: "visible",
      ref: "roomNumber"
    },
    injectionType: {
      kind: "const",
      visibility: "visible",
      ref: "injectionType"
    },
    subcutaneousInjectionType: {
      kind: "const",
      visibility: "visible",
      ref: "subcutaneousInjectionType"
    },
    subcutaneousInjectionTypeOther: {
      kind: "const",
      visibility: "visible",
      ref: "subcutaneousInjectionTypeOther"
    },
    subcutaneousInjectionPostOperation: {
      kind: "const",
      visibility: "visible",
      ref: "subcutaneousInjectionPostOperation"
    },
    postOperationDay: {
      kind: "const",
      visibility: "visible",
      ref: "postOperationDay"
    },
    analgesicType: {
      kind: "const",
      visibility: "visible",
      ref: "analgesicType"
    },
    ipDoseVolume: {
      kind: "const",
      visibility: "visible",
      ref: "ipDoseVolume"
    },
    ipInoculumAdministered: {
      kind: "const",
      visibility: "visible",
      ref: "ipInoculumAdministered"
    },
    ipInoculumBatchNumber: {
      kind: "const",
      visibility: "visible",
      ref: "ipInoculumBatchNumber"
    },
    ipInjectionPurpose: {
      kind: "const",
      visibility: "visible",
      ref: "ipInjectionPurpose"
    },
    ipInjectionPurposeOther: {
      kind: "const",
      visibility: "visible",
      ref: "ipInjectionPurposeOther"
    },
    additionalComments: {
      kind: "const",
      visibility: "visible",
      ref: "additionalComments"
    }

  },
  validationSchema: z.object({
    roomNumber: z.string(),
    injectionType: z.enum(["Subcutaneous","IP"]),
    subcutaneousInjectionType: z.enum(["Analgesic", "Other"]).optional(),
    subcutaneousInjectionTypeOther: z.string().optional(),
    subcutaneousInjectionPostOperation: z.boolean().optional(),
    postOperationDay: z.date().optional(),
    analgesicType: z.enum(["Carprofen", "Bupivacaine"]).optional(),
    ipDoseVolume: z.number().min(0).optional(),
    ipInoculumAdministered: z.enum(["PU-AD", "PU-AD Vehicle", "IP Tamoxifen", "STZ","Dexmedetomidine"]).optional(),
    ipInoculumBatchNumber: z.string().optional(),
    ipInjectionPurpose: z.enum(["Viral memetic","Intervention","Drug treatment", "Anesthetic","Other"]).optional(),
    ipInjectionPurposeOther: z.string().optional(),
    additionalComments: z.string().optional()
  })
});
