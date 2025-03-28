/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

type BuryingItemType = "Food" | "Marbles"


function createDependentField<const T>(field: T, fn: (buryingItemType?: BuryingItemType) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['itemBuried'] as const,
    render: (data: { itemBuried?: BuryingItemType }) => {
      if (fn(data.itemBuried)) {
        return field;
      }
      return null;
    }
  };
}


export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'Marble burying', 'Food Burying'],
  internal: {
    edition: 1,
    name: 'MOUSE_BURYING_TASK_FORM'
  },
  content: {
    roomNumber: {
      kind: 'string',
      variant: "input",
      label: "Room number"
    },
    itemBuried: {
      kind: 'string',
      variant: "radio",
      label: "Item buried",
      options: {
        "Marbles": "Marbles",
        "Food": "Food"
      }
    },
    cageNumber: createDependentField({
      kind: 'string',
      variant: "input",
      label: "Cage number"
    }, (type) => type === "Marbles"),
    percentageMarblesBuried: createDependentField({
      kind: 'string',
            variant: "radio",
            label: "Percentage range of marbles buried",
            options: {
              "100 %": "100 %",
              "100 - 75%": "100 - 75%",
              "75% - 0%":"75% - 0%"
            }
    },(type) => type === "Marbles"),

    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional Comments"
    }
  },
  clientDetails: {
    estimatedDuration: 2,
    instructions: ['To be filled in whenever the animal completes a burying task. Before the form is used the user must know what item the animal has buried as well as the location the task took place in']
  },
  details: {
    description: 'A form to track data from whenever an animal is weighed.',
    license: 'Apache-2.0',
    title: 'Mouse Behavioral Experiment Form'
  },
  measures: {
    roomNumber: {
      kind: 'const',
      visibility: 'visible',
      ref: "roomNumber"
    },
    itemBuried: {
      kind: 'const',
      visibility: 'visible',
      ref: "itemBuried"
    },
    cageNumber: {
      kind: 'const',
      visibility: 'visible',
      ref: "cageNumber"
    },
    percentageMarblesBuried: {
      kind: 'const',
      visibility: 'visible',
      ref: "percentageMarblesBuried"
    },
    additionalComments: {
      kind: 'const',
      visibility: 'visible',
      ref: 'additionalComments'
    }

  },
  validationSchema: z.object({
    roomNumber: z.string(),
    itemBuried: z.enum(["Marbles","Food"]),
    cageNumber: z.string().optional(),
    percentageMarblesBuried: z.enum(["100 %","100 - 75%","75% - 0%"]).optional(),
    additionalComments: z.string().optional()
  })
});
