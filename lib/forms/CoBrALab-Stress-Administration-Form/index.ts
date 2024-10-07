/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

function createDependentField<const T>(field: T, fn: (stressorType: string) => boolean) {
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
  tags: ['Stress', 'Tail suspension', 'Restraint', 'Electric shock'],
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
      label: "Electric shock ampage (in milliamps)"
    },
    (type) => type === "Electric foot shocks"),
    
    tailSuspensionClimbStoppers: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Climb stoppers used"
    },
    (type) => type === "Tail suspension")
  },
  details: {
    description: 'Describes the stress administration done upon an animal, with the current possible three options being tail suspension, restraint and electric foot shocks.',
    estimatedDuration: 1,
    instructions: ['This is to be filled after a mouse is finished a stress administration session, it is expected to know how many mice were present during the session as well where it took place.'],
    license: 'Apache-2.0',
    title: 'Stress Administration Form'
  },
  measures: {
    miceNumber: {
        kind: "const",
        ref: "miceNumber"
    },
    roomNumber: {
        kind: "const",
        ref: "roomNumber"
      },
      stressorType: {
        kind: "const",
        ref: "stressorType"
      },
      footShocksNumber: {
        kind: "const",
        ref: "footShocksNumber"
      },
      footShockAmpage: {
        kind: "const",
        ref: "footShockAmpage"
      },
      tailSuspensionClimbStoppers: {
        kind: "const",
        ref: "tailSuspensionClimbStoppers"
      }
  },
  validationSchema: z.object({
    miceNumber: z.number().min(0).max(10).int(),
    roomNumber: z.string(),
    stressorType: z.string(),
    footShocksNumber: z.number().int().min(1).optional(),
    footShockAmpage: z.number().min(0).optional(),
    tailSuspensionClimbStoppers: z.boolean().optional()

  })
});
