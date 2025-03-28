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
    foodBuryingTimeCutOff: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Did the task have a time cut off"
    }, (type) => type === "Food"),

    foodBuryingTimeCutOffDuration: {
      kind: "dynamic",
      deps: ["foodBuryingTimeCutOff"],
      render(data) {
        if (data.foodBuryingTimeCutOff){
          return {
                kind: "number",
                variant: "input",
                label: "Duration of food burying task (seconds)"
          }
        }
        return null
      }
    },
    foodPosition: createDependentField({
      kind: "string",
      variant: "input",
      label: "Food position"
    }, (type) => type === "Food"),

    ethoVisionUsed: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Was Ethovision used for the task?"
    }, (type) => type === "Food"),

    ethoVisionDistanceTravelled: {
      kind: "dynamic",
      deps: ["ethoVisionUsed"],
      render(data) {
        if(data.ethoVisionUsed){
          return {
            kind: "number",
            variant: "input",
            label: "Distance travelled (cm)"
          }
        }
        return null
      }
    },
    ethoVisionLatency: {
      kind: "dynamic",
      deps: ["ethoVisionUsed"],
      render(data) {
        if(data.ethoVisionUsed){
          return {
            kind: "number",
            variant: "input",
            label: "Ethovision latency (ms)"
          }
        }
        return null
      }
    },

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
    foodBuryingTimeCutOff: {
    kind: 'const',
    visibility: 'visible',
    ref: "foodBuryingTimeCutOff"
    },
    foodBuryingTimeCutOffDuration: {
      kind: 'const',
      visibility: 'visible',
      ref: "foodBuryingTimeCutOffDuration"
    },
    foodPosition: {
      kind: 'const',
      visibility: 'visible',
      ref: "foodPosition"
    },
    ethoVisionUsed: {
      kind: 'const',
      visibility: 'visible',
      ref: "ethoVisionUsed"
    },
    ethoVisionDistanceTravelled: {
      kind: 'const',
      visibility: 'visible',
      ref: "ethoVisionDistanceTravelled"
    },
    ethoVisionLatency: {
      kind: 'const',
      visibility: 'visible',
      ref: "ethoVisionLatency"
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
    foodBuryingTimeCutOff: z.boolean(),
    foodBuryingTimeCutOffDuration: z.number().min(0).int().optional(),
    foodPosition: z.string().optional(),
    ethoVisionUsed: z.boolean().optional(),
    ethoVisionDistanceTravelled: z.number().min(0).optional(),
    ethoVisionLatency: z.number().min(0).optional(),
    additionalComments: z.string().optional()
  })
});
