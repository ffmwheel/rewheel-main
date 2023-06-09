import { useBLECharacteristic } from "./useBLECharacteristic"

export const RideMode = {
  EnterFactoryMode: 0xcbcb,
  CalibrateMotorOld: 0xcccc,
  CalibrateMotor: 0xcaea,
  CalibrateRepair: 0xcaca,
  FactoryMode: 0xcb,
  V1Classic: 0x01,
  V1Extreme: 0x02,
  V1ElevatedBay: 0x03,
  SequoiaRoam: 0x04,
  CruzRedwoodFlow: 0x05,
  MissionPacificHighline: 0x06,
  Elevated: 0x07,
  DeliriumSkylineApex: 0x08,
  Custom: 0x09,
}

export const RideModeReverseMap = (generation) => {
  return {
    0x01: "Classic",
    0x02: "Extreme",
    0x03: generation === 6 ? "Bay" : "Elevated",
    0x04: generation === 6 ? "Roam" : "Sequoia",
    0x05: generation <= 4 ? "Cruz" : generation === 6 ? "Flow" : "Redwood",
    0x06: generation <= 4 ? "Mission" : generation === 6 ? "Highline" : "Pacific",
    0x07: "Elevated",
    0x08: generation <= 4 ? "Delirium" : generation === 6 ? "Apex" : "Skyline",
    0x09: "Custom",
  }
}

export const isSpecialRidingMode = (mode) => mode >= RideMode.FactoryMode

export const useRideMode = (operations) => {
  const { rideMode, writeRideMode } = useBLECharacteristic("rideMode", {
    read: true,
    write: true,
    notify: true,
    autoMount: true,
    ...operations,
  })

  const setRideMode = async (mode) => {
    const isSpecialMode = isSpecialRidingMode(mode)
    const buffer = new Uint8Array(isSpecialMode ? 2 : 1)
    const view = new DataView(buffer.buffer)
    isSpecialMode ? view.setUint16(0, mode) : view.setUint8(0, mode)
    await writeRideMode(view)
  }

  const parseRideMode = (view) => {
    if (!view) return null
    if (view.byteLength === 1) {
      return view.getUint8(0)
    } else if (view.byteLength === 2) {
      return view.getUint8(1)
    } else {
      console.warn("invalid mode", view)
    }
  }

  return {
    rideMode: parseRideMode(rideMode),
    setRideMode,
  }
}
