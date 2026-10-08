/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Cannabis', 'Vaporization', 'Inhalation', 'CBD', 'THC'],
  internal: {
    edition: 1,
    name: 'CANNABIS_ADMINISTRATION_FORM'
  },
  content: {
    substance: {
      kind: 'string',
      variant: 'select',
      label: 'Substance',
      options: {
        "Cannabis": "Cannabis",
        "Control": "Control",
        "Other": "Other"
      }
    },
    otherSubstance: {
      kind: 'dynamic',
      deps: ['substance'],
      render(data) {
        if (data.substance === "Other") {
          return {
            kind: 'string',
            variant: 'input',
            label: 'Other substance'
          }
        }
        return null
      }
    },
    cannabisName: {
      kind: 'dynamic',
      deps: ['substance'],
      render(data) {
        if (data.substance === "Cannabis") {
          return {
            kind: 'string',
            variant: 'input',
            label: 'Name of cannabis (optional)'
          }
        }
        return null
      }
    },
    cbdPercentage: {
      kind: 'dynamic',
      deps: ['substance'],
      render(data) {
        if (data.substance === "Cannabis") {
          return {
            kind: 'number',
            variant: 'input',
            label: '% CBD'
          }
        }
        return null
      }
    },
    thcPercentage: {
      kind: 'dynamic',
      deps: ['substance'],
      render(data) {
        if (data.substance === "Cannabis") {
          return {
            kind: 'number',
            variant: 'input',
            label: '% THC'
          }
        }
        return null
      }
    },
    cannabisAmount: {
      kind: 'dynamic',
      deps: ['substance'],
      render(data) {
        if (data.substance === "Cannabis") {
          return {
            kind: 'number',
            variant: 'input',
            label: 'Amount of ground cannabis (mg)'
          }
        }
        return null
      }
    },
    cannabisNotes: {
      kind: 'dynamic',
      deps: ['substance'],
      render(data) {
        if (data.substance === "Cannabis") {
          return {
            kind: 'string',
            variant: 'textarea',
            label: 'Other notes'
          }
        }
        return null
      }
    },
    controlType: {
      kind: 'dynamic',
      deps: ['substance'],
      render(data) {
        if (data.substance === "Control") {
          return {
            kind: 'string',
            variant: 'radio',
            label: 'Control',
            options: {
              "Hot air": "Hot air",
              "Oregano": "Oregano"
            }
          }
        }
        return null
      }
    },
    oreganoAmount: {
      kind: 'dynamic',
      deps: ['substance', 'controlType'],
      render(data) {
        if (data.substance === "Control" && data.controlType === "Oregano") {
          return {
            kind: 'number',
            variant: 'input',
            label: 'Amount of oregano (mg)'
          }
        }
        return null
      }
    },
    temperatureSetting: {
      kind: 'number',
      variant: 'slider',
      label: 'Temperature setting (1-9)',
      min: 1,
      max: 9
    },
    timeAirOn: {
      kind: 'number',
      variant: 'input',
      label: 'Time air on (minutes)',
      description: 'Whole minutes, range: 0 - 60'
    },
    timeAfterAirOff: {
      kind: 'number',
      variant: 'input',
      label: 'Time after air off (minutes)',
      description: 'Whole minutes, range: 0 - 60'
    }
  },
  details: {
    description: 'Records a vaporized cannabis administration session, including the substance administered (cannabis, a hot air or oregano control, or another substance), the vaporizer temperature setting and air timing.',
    license: 'Apache-2.0',
    title: 'Cannabis Administration Form'
  },
  clientDetails: {
    instructions: ['This is to be filled after a mouse has finished a vaporized cannabis administration session.'],
    estimatedDuration: 2
  },
  measures: {
    substance: {
      kind: 'const',
      visibility: 'visible',
      ref: 'substance'
    },
    otherSubstance: {
      kind: 'const',
      visibility: 'visible',
      ref: 'otherSubstance'
    },
    cannabisName: {
      kind: 'const',
      visibility: 'visible',
      ref: 'cannabisName'
    },
    cbdPercentage: {
      kind: 'const',
      label: '% CBD',
      visibility: 'visible',
      ref: 'cbdPercentage'
    },
    thcPercentage: {
      kind: 'const',
      label: '% THC',
      visibility: 'visible',
      ref: 'thcPercentage'
    },
    cannabisAmount: {
      kind: 'const',
      label: 'Amount of ground cannabis (mg)',
      visibility: 'visible',
      ref: 'cannabisAmount'
    },
    cannabisNotes: {
      kind: 'const',
      visibility: 'visible',
      ref: 'cannabisNotes'
    },
    controlType: {
      kind: 'const',
      visibility: 'visible',
      ref: 'controlType'
    },
    oreganoAmount: {
      kind: 'const',
      label: 'Amount of oregano (mg)',
      visibility: 'visible',
      ref: 'oreganoAmount'
    },
    temperatureSetting: {
      kind: 'const',
      visibility: 'visible',
      ref: 'temperatureSetting'
    },
    timeAirOn: {
      kind: 'const',
      label: 'Time air on (minutes)',
      visibility: 'visible',
      ref: 'timeAirOn'
    },
    timeAfterAirOff: {
      kind: 'const',
      label: 'Time after air off (minutes)',
      visibility: 'visible',
      ref: 'timeAfterAirOff'
    }
  },
  validationSchema: z.object({
    substance: z.enum(['Cannabis', 'Control', 'Other']),
    otherSubstance: z.string().optional(),
    cannabisName: z.string().optional(),
    cbdPercentage: z.number().min(0).max(100).optional(),
    thcPercentage: z.number().min(0).max(100).optional(),
    cannabisAmount: z.number().min(0).max(1000).optional(),
    cannabisNotes: z.string().optional(),
    controlType: z.enum(['Hot air', 'Oregano']).optional(),
    oreganoAmount: z.number().min(0).max(1000).optional(),
    temperatureSetting: z.number().int().min(1).max(9),
    timeAirOn: z.number().int().min(0).max(60),
    timeAfterAirOff: z.number().int().min(0).max(60)
  }).superRefine((data, ctx) => {
    const requireField = (path: string) => {
      ctx.addIssue({
        code: "custom",
        path: [path],
        message: "This field is required."
      });
    };
    if (data.substance === "Other" && !data.otherSubstance) {
      requireField("otherSubstance");
    }
    if (data.substance === "Cannabis") {
      if (data.cbdPercentage === undefined) {
        requireField("cbdPercentage");
      }
      if (data.thcPercentage === undefined) {
        requireField("thcPercentage");
      }
      if (data.cannabisAmount === undefined) {
        requireField("cannabisAmount");
      }
    }
    if (data.substance === "Control") {
      if (!data.controlType) {
        requireField("controlType");
      }
      if (data.controlType === "Oregano" && data.oreganoAmount === undefined) {
        requireField("oreganoAmount");
      }
    }
  })
});
