/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');


function createDependentField<const T>(field: T, fn: (motorTask: string) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['motorTask'] as const,
    render: (data: { motorTask: string }) => {
      if (fn(data.motorTask)) {
        return field;
      }
      return null;
    }
  };
}

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Rotorod', 'Motor tasks', 'Wire Hang', 'Pole test'],
  internal: {
    edition: 1,
    name: 'MOUSE_MOTOR_TASK_FORM'
  },
  content: {
    roomNumber: {
      kind: "string",
      variant: "input",
      label: "Room number"
    },
    motorTask: {
      kind: "string",
      variant: "select",
      label: "Motor task",
      options: {
        "Rotorod": "Rotorod",
        "Wire hang": "Wire hang",
        "Pole test": "Pole test"
      }
    },
    rotorodMiceNumber: createDependentField({
      kind: "number",
      variant: "slider",
      label: "Number of mice",
      max: 5,
      min: 1
    },(type) => type === "Rotorod"),

    rotorodDuration:createDependentField({
      kind: "number",
      variant: "input",
      label: "Duration before falling (seconds)"
    },(type) => type === "Rotorod"),

    rotorodSlotPosition: createDependentField({
      kind: "string",
      variant: "select",
      label: "Rotorod position",
      options: {
        "Left most": "Left most",
        "Middle left": "Middle left",
        "Middle right": "Middle right",
        "Right most": "Right most"
      }
    }, (type) => type === "Rotorod"),
    rotorodWirehangFailure: createDependentField({
      kind: "boolean",
      variant: "radio",
      label: "Mouse failed session"
    }, (type) => type === "Rotorod" || type === "Wire hang" ),
    
    wirehangDuration:createDependentField({
      kind: "number",
      variant: "input",
      label: "Longest duration before falling (seconds)"
    },(type) => type === "Wire hang"),

    wirehangPutbacks: createDependentField({
      kind: "number",
      variant: "input",
      label: "Times put back on wire"
    },(type) => type === "Wire hang"),

    poleTestDuration: createDependentField({
      kind: "number",
      variant: "input",
      label: "Pole test duration (seconds)"
    }, (type) => type === "Pole test"),

    poleTestResultLevel: createDependentField({
      kind: "string",
      variant: "select",
      label: "Pole test result",
      options: {
        "Pass": "Pass",
        "Marginal failure" :"Marginal failure",
        "Failure": "Failure"
      }
    }, (type) => type === "Pole test"),

    poleTestMarginalFailureReason: {
      kind: "dynamic",
      deps: ["poleTestResultLevel"],
      render(data) {
        if(data.poleTestResultLevel === "Marginal failure"){
          return {
            kind: "string",
            variant: "textarea",
            label: "Reason for marginal failure"

          }
        }
        return null
      }
    }
  },
  details: {
    description: 'Form to describe data gathered in a mouse\'s motor task experiment',
    estimatedDuration: 1,
    instructions: ["To be filled in whenever a mouse completes a motor task. It is expected that the motor task session as well as the tool used (Rotorod, Pole test, wire hang) is known."],
    license: 'UNLICENSED',
    title: 'Mouse Motor Task'
  },
  measures: {
    roomNumber: {
      kind: "const",
      ref: "roomNumber"
    },
    motorTask: {
      kind: "const",
      ref: "motorTask"
    },
    rotorodMiceNumber: {
      kind: "const",
      ref: "rotorodMiceNumber"
    },
    rotorodDuration: {
      kind: "const",
      ref: "rotorodDuration"
    },
    rotorodSlotPosition: {
      kind: "const",
      ref: "rotorodSlotPosition"
    },
    rotorodWirehangFailure: {
      kind: "const",
      ref: "rotorodWirehangFailure"
    },
    wirehangDuration: {
      kind: "const",
      ref: "wirehangDuration"
    },
    wirehangPutbacks: {
      kind: "const",
      ref: "wirehangPutbacks"
    },
    poleTestDuration: {
      kind: "const",
      ref: "poleTestDuration"
    },
    poleTestResultLevel: {
      kind: "const",
      ref: "poleTestResultLevel"
    },
    poleTestMarginalFailureReason: {
      kind: "const",
      ref: "poleTestMarginalFailureReason"
    }
  },
  validationSchema: z.object({
    roomNumber: z.string(),
    motorTask: z.string(),
    rotorodMiceNumber: z.number().min(1).max(51).optional(),
    rotorodDuration: z.number().min(0).optional(),
    rotorodWirehangFailure: z.boolean().optional(),
    rotorodSlotPosition: z.string().optional(),
    wirehangDuration: z.number().min(0).optional(),
    wirehangPutbacks: z.number().min(0).int().optional(),
    poleTestDuration: z.number().min(0).optional(),
    poleTestResultLevel: z.string().optional(),
    poleTestMarginalFailureReason: z.string().optional()
  })
});
