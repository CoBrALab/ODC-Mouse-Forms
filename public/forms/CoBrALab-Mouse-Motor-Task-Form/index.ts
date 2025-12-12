/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');


type MotorTask =  "Rotarod" | "Wire hang" | "Pole test" | "Grip force";

function createDependentField<const T>(field: T, fn: (motorTask?: MotorTask) => boolean) {
  return {
    kind: 'dynamic' as const,
    deps: ['motorTask'] as const,
    render: (data: { motorTask?: MotorTask }) => {
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
  tags: ['Rotarod', 'Motor tasks', 'Wire Hang', 'Pole test', 'Grip force'],
  internal: {
    edition: 3,
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
        "Rotarod": "Rotarod",
        "Wire hang": "Wire hang",
        "Pole test": "Pole test",
        "Grip force": "Grip force"
      }

    },
    rotarodTotalMiceNumber: createDependentField({
      kind: "number",
      variant: "slider",
      label: "Number of mice on apparatus during the current mouse's task (including mouse)",
      max: 4,
      min: 1
    },(type) => type === "Rotarod"),

    rotarodDuration:createDependentField({
      kind: "number",
      variant: "input",
      label: "Duration before falling (seconds)"
    },(type) => type === "Rotarod"),

    rotarodSlotPosition: createDependentField({
      kind: "string",
      variant: "select",
      label: "Rotarod position",
      options: {
        "Left most": "Left most",
        "Middle left": "Middle left",
        "Middle right": "Middle right",
        "Right most": "Right most"
      }
    }, (type) => type === "Rotarod"),
   
    
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
    },
    gripForceAmount: createDependentField({
  kind: "number",
  variant: "input",
  label: "Grip force amount (grams)"
}, (type) => type === "Grip force"),
  rotarodWirehangGripForceFailure: createDependentField({
        kind: "boolean",
        variant: "radio",
        label: "Mouse failed session"
      }, (type) => type === "Rotarod" || type === "Wire hang" || type === "Grip force"),

    additionalComments: {
      kind: "string",
      variant: "textarea",
      label: "Additional comments"
    }
  },
  clientDetails: {
    estimatedDuration: 1,
    instructions: ["To be filled in whenever a mouse completes a motor task. It is expected that the motor task session as well as the tool used (Rotarod, Pole test, wire hang) is known."]
  },
  details: {
    description: 'Form to describe data gathered in a mouse\'s motor task experiment',
    license: 'Apache-2.0',
    title: 'Mouse Motor Task'
  },
  measures: {
    roomNumber: {
      kind: "const",
      visibility: "visible",
      ref: "roomNumber"
    },
    motorTask: {
      kind: "const",
      visibility: "visible",
      ref: "motorTask"
    },
    rotarodTotalMiceNumber: {
      kind: "const",
      visibility: "visible",
      ref: "rotarodTotalMiceNumber"
    },
    rotarodDuration: {
      kind: "const",
      visibility: "visible",
      ref: "rotarodDuration"
    },
    rotarodSlotPosition: {
      kind: "const",
      visibility: "visible",
      ref: "rotarodSlotPosition"
    },
    rotarodWirehangFailure: {
      kind: "const",
      visibility: "visible",
      ref: "rotarodWirehangGripForceFailure"
    },
    wirehangDuration: {
      kind: "const",
      visibility: "visible",
      ref: "wirehangDuration"
    },
    wirehangPutbacks: {
      kind: "const",
      visibility: "visible",
      ref: "wirehangPutbacks"
    },
    poleTestDuration: {
      kind: "const",
      visibility: "visible",
      ref: "poleTestDuration"
    },
    poleTestResultLevel: {
      kind: "const",
      visibility: "visible",
      ref: "poleTestResultLevel"
    },
    poleTestMarginalFailureReason: {
      kind: "const",
      visibility: "visible",
      ref: "poleTestMarginalFailureReason"
    },
    gripForceAmount: {
      kind: "const",
      visibility: "visible",
      ref: "gripForceAmount"
    },

    additionalComments: {
      kind: "const",
      visibility: "visible",
      ref: "additionalComments"
    }
  },
  validationSchema: z.object({
    roomNumber: z.string(),
    motorTask: z.enum(["Rotarod" , "Wire hang" , "Pole test", "Grip force"]),
    rotarodTotalMiceNumber: z.number().min(1).max(4).optional(),
    rotarodDuration: z.number().min(0).optional(),
    rotarodSlotPosition: z.enum(["Left most", "Middle left", "Middle right", "Right most"]).optional(),
    rotarodWirehangGripForceFailure: z.boolean().optional(),
    wirehangDuration: z.number().min(0).optional(),
    wirehangPutbacks: z.number().min(0).int().optional(),
    poleTestDuration: z.number().min(0).optional(),
    poleTestResultLevel: z.enum(["Pass", "Marginal failure", "Failure"]).optional(),
    poleTestMarginalFailureReason: z.string().optional(),
    gripForceAmount: z.number().int().min(1).optional(),
    additionalComments: z.string().optional()
  })
});
