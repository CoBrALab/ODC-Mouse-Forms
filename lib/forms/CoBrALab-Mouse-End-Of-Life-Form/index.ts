/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

function createDependentField<T>(field: T, fn: (bodyExtractionDone: boolean) => boolean) {
    return {
      kind: 'dynamic' as const,
      deps: ["bodyExtractionDone"] as const,
      render: (data: { bodyExtractionDone: boolean }) => {
        if (fn(data.bodyExtractionDone)) {
          return field;
        }
        return null;
      }
    };
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['End of Life', 'Mouse', 'Euthanasia','Termination'],
  internal: {
    edition: 1,
    name: 'MOUSE_END_OF_LIFE_FORM'
  },
  content: {
    terminationReason: {
      kind: 'string',
      variant: 'select',
      label: "Reason for termination",
      options: {
        "End of Experiment":"End of Experiment",
        "Humane endpoint": "Humane Endpoint",
        "Veterinary Endpoint": "Veterinary Endpoint",
        "Surplus":"Surplus",
        "Surgical complications":"Surgical complications",
      }
    },
    terminationComments: {
     kind: 'dynamic',
     deps: ["terminationReason"],
     render(data) {
        if(data.terminationReason === "Humane endpoint" || data.terminationReason === "Surplus" ){
          return {
            kind: 'string',
            variant: "textarea",
            label: "Comments"
          }
        }
        return null
     }
    },
    terminationType: {
      kind: "string",
      variant: 'select',
      label: 'Form of termination',
      options: {
        "Gas induction":"Gas induction",
        "Perfusion": "Perfusion",
        "Guillotine": "Guillotine",
        "Cardiac puncture":"Cardiac puncture",
        "Cervical dislocation": "Cervical dislocation"
      }
    },
    bodyExtractionDone: {
      kind: 'boolean',
      variant: "radio",
      label: "Body part extracted"
    },
    bodyPartExtracted: createDependentField({
      kind: 'set',
      variant: "listbox",
      label: "Body part extracted",
      options: {
        "Brain":"Brain",
        "Gut": "Gut",
        "Fat tissue": "Fat tissue",
        "Heart":"Heart"
    },
    }, (type) => type === true),
    bodyExtractionReason: createDependentField({
      kind: 'string',
      variant: "textarea",
      label: "Reason for Extraction"
    }, (type) => type === true)
  },
  details: {
    description: 'Form to fill in info of mouse end of life',
    estimatedDuration: 1,
    instructions: ['End of life', 'termination'],
    license: 'UNLICENSED',
    title: 'Mouse End Of Life Form'
  },
  measures: {},
  validationSchema: z.object({
    terminationReason: z.string(),
    terminationComments: z.string(),
    terminationType: z.string(),
    bodyExtractionDone: z.boolean(),
    bodyPartExtracted: z.set(z.enum(["Brain","Gut", "Heart", "Fat tissue"])),
    bodyExtractionReason: z.string()
  })
});