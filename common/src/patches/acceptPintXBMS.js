import { BoardGeneration } from "../utils/board.js"

export const acceptPintXBMS = {
  attribution: [
    "exPHAT",
  ],
  priority: 3,
  supported: [BoardGeneration.Pint],
  supportsOta: true,
  modifications: [
    { // XR
      start: {
        5040: 0xecde,
      },
      data: [0x05]
    },
    { // Pint X
      start: {
        5040: 0xece2,
      },
      data: [0x0a]
    },
    {
      start: {
        5040: 0xece6,
      },
      data: [0x0b]
    },
  ],
}
