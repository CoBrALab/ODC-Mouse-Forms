/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');


function createDependentField<T>(field: T, fn: (motorTask: string) => boolean) {
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
    trialNumber: {
      kind: "number",
      variant: "radio",
      label: "trial number",
      options: {
        1: "one",
        2: "two",
        3: "three"
      }
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

    rotorodPosition: createDependentField({
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
    }, (type) => type === "Rotorod" || type === "Wire hang" )


  },
  details: {
    description: 'Form to describe data gathered in a mouse\'s motor task experiment',
    estimatedDuration: 1,
    instructions: ["To be filled in whenever a mouse completes a motor task. It is expected that the motor task session as well as the tool used (Rotorod, Pole test, wire hang) is known."],
    license: 'UNLICENSED',
    title: 'Mouse Motor Task'
  },
  measures: {},
  validationSchema: z.object({
    roomNumber: z.string(),
    trialNumber: z.number(),
    motorTask: z.string(),
    rotorodMiceNumber: z.number().optional(),
    rotorodDuration: z.number().optional(),
    rotorodWirehangFailure: z.boolean().optional(),
    rotorodPosition: z.string().optional()
  })
});
