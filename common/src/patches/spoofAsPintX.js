import { BoardGeneration } from "../utils/board.js"

export const spoofAsPintX = {
  attribution: [
    "exPHAT",
  ],
  priority: 3,
  supported: [BoardGeneration.Pint],
  supportsOta: true,
  modifications: [
    {
      start: {
        5040: 0x9e28,
      },
      data: [0x4F, 0xF4, 0xAF, 0x61]
    },
  ],
}
