/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

function createDependentField<T>(field: T, fn: (stressorType: string) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['stressorType'] as const,
    render: (data: { stressorType: string }) => {
      if (fn(data.stressorType)) {
        return field;
      }
      return null;
    }
  };
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Stress', 'Tail suspension', 'restraint', 'electric shock'],
  internal: {
    edition: 1,
    name: 'STRESS_ADMINISTRATION_FORM'
  },
  content: {
    miceNumber: {
      kind: "number",
      variant: "slider",
      label: "Number of mice",
      max: 10,
      min: 1
    },
    roomNumber: {
      kind: "string",
      variant: "input",
      label: "Room number"  
    },
    stressorType: {
      kind: "string",
      variant: "select",
      label: "Type of stressor",
      options: {
        "Electric foot shocks": "Electric foot shocks",
        "Tail suspension": "Tail suspension",
        "Restraint": "Restraint"
      }
    },

    footShocksNumber: createDependentField({
      kind: "number",
      variant: "input",
      label: "Number of foot shocks"
    }, (type) => type === "Electric foot shocks"),

    footShockAmpage: createDependentField({
      kind: "number",
      variant: "input",
      label: "Electric shock ampage (in milli-amps)"
    },
    (type) => type === "Electric foot shocks"),
    
    tailSupensionClimbers: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Climb stoppers used"
    },
    (type) => type === "Tail suspension")
  },
  details: {
    description: '<PLACEHOLDER>',
    estimatedDuration: 1,
    instructions: ['<PLACEHOLDER>'],
    license: 'UNLICENSED',
    title: 'Stress Administration Form'
  },
  measures: {},
  validationSchema: z.object({
    miceNumber: z.number(),
    roomNumber: z.string(),
    stressorType: z.string(),
    footShocksNumber: z.number().int().min(1).optional(),
    footShockAmpage: z.number().min(0).optional(),
    tailSuspensionClimbers: z.boolean().optional()

  })
});
