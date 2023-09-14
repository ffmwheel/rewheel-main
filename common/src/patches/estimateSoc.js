import {
  allGenerations,
  BoardGeneration
} from "../utils/board.js"
import {
  fromHexString,
  uintByteArray,
  encodeBlInstruction
} from "../utils/helpers.js"

const CAPACITY_MIN_MAH = 2600
const CAPACITY_MAX_MAH = 16000

const ADDRESSES = {
  regen: {
    5040: 0x20001BD8,
    6109: 0x20002B0C
  },
  trip: {
    5040: 0x20001BD4,
    6109: 0x20002B04
  },
  voltages: {
    5040: 0x20001ABC,
    6109: 0x20002988
  },
  soc: {
    5040: 0x20001C38,
    6109: 0x20002B80
  }
}

const appendedCode = "02000000481c0020394b30b57b4419680b78002b48d1374a7a441488364a7a441068dab2a24205da30f812200133002af7d130bd01220388944207dd30f812500132ab4228bf2b46d2b2f5e72b4a7a441288b3fbf2f340f68b22934245d941f26702934228bf1346a3f68c239bb23222b3fbf2f0224a7a44145c02441e20434340f2dc50b3fbf0f500fb15335278121b534393fbf0f32344642ba8bf642323eae3734b7001230b70164b4a787b4418681549164b79447b441b6809681b6809685b1a44f6206193fbf1f364214b4310497944098893fbf1f35bb2d31a642ba8bf642323eae3730370a3e70023bfe700bff4ffffff1a0100001a010000e20000009a000000880000008c000000860000007400000000000000010203040507080b0e101213191e21252b30353c43474c525c61640001000f00381c0020bc1a0020d41b0020d81b0020280a"

const extraBytes = (() => {
  const bytes = fromHexString(appendedCode)
  const view = new DataView(bytes.buffer)

  return view.getUint32(0, true)
})()

export const estimateSoc = {
  priority: 3,
  description: `Estimates the state of charge via battery voltage and capacity`,
  attribution: [
    "exPHAT"
  ],
  supported: allGenerations,
  supportsOta: true,
  extraBytes,
  args: {
    batteryCapacityMah: {
      required: true,
      type: 'number',
      min: CAPACITY_MIN_MAH,
      max: CAPACITY_MAX_MAH,
    },
  },
  experimental: true,
  confirm: true,
  modifications: ({ batteryCapacityMah, revision, bssEnd, lastByte }) => {
    batteryCapacityMah = parseInt(batteryCapacityMah)
    if (isNaN(batteryCapacityMah))
      throw "notANumber"

    if (batteryCapacityMah < CAPACITY_MIN_MAH || batteryCapacityMah > CAPACITY_MAX_MAH)
      throw "outOfRange"

    let cellCount = 0
    let scalingFactor = 0
    switch (Math.floor(revision / 1000)) {
      case BoardGeneration.GT:
        cellCount = 18
        scalingFactor = 10
        break
      case BoardGeneration.XR:
        cellCount = 15
        scalingFactor = 1
      case BoardGeneration.Pint:
        cellCount = 15
        scalingFactor = 1
        break
      default:
        throw "unsupportedBoard"
    }

    const patchLocation = {
      5040: 0xea24,
      6109: 0x30f48
    }

    return [
      { // Add bl instruction inside BMS message parser
        start: {
          5040: patchLocation[5040],
          6109: patchLocation[6109]
        },
        data: [...uintByteArray(encodeBlInstruction(lastByte + 8, patchLocation[revision]), 4, false), ...uintByteArray(0x1520, 2, false)],
      },
      { // Append SOC-estimation code to binary
        append: true,
        data: [...fromHexString(appendedCode)],
      },
      { // Update the BSS location pointer
        start: {
          5040: lastByte + 4,
          6109: lastByte + 4,
        },
        data: uintByteArray(bssEnd, 4, true),
      },
      { // Overwrite battery capacity value inside the appended code
        start: {
          5040: -2,
          6109: -2,
        },
        data: uintByteArray(batteryCapacityMah, 2, true),
      },
      { // Regen address
        start: {
          5040: -6,
          6109: -6,
        },
        data: uintByteArray(ADDRESSES.regen[revision], 4, true),
      },
      { // Trip address
        start: {
          5040: -10,
          6109: -10,
        },
        data: uintByteArray(ADDRESSES.trip[revision], 4, true),
      },
      { // Voltages address
        start: {
          5040: -14,
          6109: -14,
        },
        data: uintByteArray(ADDRESSES.voltages[revision], 4, true),
      },
      { // SOC address
        start: {
          5040: -18,
          6109: -18,
        },
        data: uintByteArray(ADDRESSES.soc[revision], 4, true),
      },
      { // Cell count
        start: {
          // Needs to be aligned to halfword even though it's a single byte
          5040: -20,
          6109: -20
        },
        data: uintByteArray(cellCount, 2, true),
      },
      { // Scaling factor
        start: {
          5040: -22,
          6109: -22
        },
        data: uintByteArray(scalingFactor, 2, true),
      },
    ]
  },
}
