/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/opendatacapture@1.0.0/core.js');
const { z } = await import('/runtime/v1/zod@3.23.6/index.js');

export default defineInstrument({
  kind: 'FORM',
  language: 'en',
  tags: ['Mouse', 'MRI', 'Structural', 'FMRI'],
  internal: {
    edition: 1,
    name: 'MOUSE_MRI_FORM'
  },
  content: {
    handlerName: {
        kind: "string",
        variant: "input",
        label: "Name of handler"
    },
    mriOperator: {
        kind: "string",
        variant: "input",
        label: "MRI operator"
    },
    typeOfMRI: {
        kind: "string",
        variant: 'select',
        label:"Type of MRI done",
        options: {
            "Ex-vivo structural":"Ex-vivo structural",
            "In-vivo structural": "In-vivo structural",
            "Structural and FMRI": "Structural and FMRI",
            "Quantitative":"Quantitative"
        }
    }
  },
  details: {
    description: "This form is used to record the data tracked in a mouse's MRI session",
    estimatedDuration: 1,
    instructions: ['Please fill out this for individual mouse MRI sessions'],
    license: 'UNLICENSED',
    title: 'Mouse MRI Form'
  },
  measures: {},
  validationSchema: z.object({
    handlerName: z.string(),
    mriOperator: z.string(),
    typeOfMRI: z.string()
  })
});
