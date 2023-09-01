# Rewheel

Firmware modification tools for the Onewheel Pint, Pint X, XR and GT. Part of the R2Row ('Arturo') project.

> [!IMPORTANT]  
> Now hosted at https://autumn-bar-0505.on.fleek.co/

_Note: The documentation below is for developers. If you just want to re-calibrate your board or patch some firmware, please use the link above._

## Requirements

- Node.js
- Yarn 2+ (`yarn set version stable` if you have an Yarn 1.x) 

## Installation

- Run `yarn` to install all dependencies from the root directory

## Parts

- `@rewheel/common` - common library that contains all of the patches + common tooling
- `@rewheel/cli` - command line interface for patching firmware
- `@rewheel/web` - website for patching firmware + flashing to a device

### CLI

```
# usage
yarn patcher -i [input file] -o [output file] [...patches] --[patch-arg]

# example
yarn patcher -i firmware/dump/5046.bin -o 5046-patched.bin setAngleOffset --angleOfset 5
```

### Website

- Run `yarn web:dev`
- Open your browser and navigate to `http://localhost:5173`

## Firmware Operations

### Dumping Firmware

- Firmware is not provided for copyright reasons. Instructions for dumping your Onewheel firmware are provided [here](docs/DumpFirmware.md). **Warning: it's not for the faint of heart.**

### Flashing Firmware

- Instructions to flash your Onewheel are located [here](docs/FlashFirmware.md). Thankfully, this is significantly easier than dumping the firmware to begin with.

### Generate Checksum for Firmware

```
# npm
npm run checksum -- -i [input file]

# or

# yarn
yarn checksum -i [input file]
```

The patcher uses the checksum of the firmware to set the offsets of each firmware patch.

If your firmware doesn't match a known checksum, [open an issue](https://github.com/outlandnish/rewheel/issues/new?assignees=&labels=new-firmware-revision&template=support-new-firmware-revision.md&title=Add+support+for+firmware+%3Crevision%3E) for it. That way, we can find the offsets for that firmware revision and support more firmware.

## Disclaimer

- Firmware dumping uses a slightly different process on the GT because it uses a different processor. Documentation is not available just yet.
- This project is not affiliated with or endorsed by Future Motion. Proceed at your own risk - this will void your warranty.

## Contributing

If you're able to dump the firmware from a Onewheel that you own, you can use Ghidra to dive into the assembly and even live debug against a working Pint, Pint X, or XR. This can aid in finding more patches for the firmware.

## Contributors / Thanks

- [lolwheel](https://github.com/lolwheel) - patch development, first verifying the exploit from the research paper, Owie
- [beeradmoore](https://github.com/beeradmoore) - OWCE source / documentation on BLE services
- [exPHAT](https://github.com/exPhat) - colaboration on the OTA firmware stub
- [tire_sire](https://tiresire.com) - providing the initial boards to test on
- [sdmods](https://github.com/sdmods) - Updated un-bricking instructions
- [ZeeWorden Design](https://www.zeewordendesign.com/) - Rewheel logo

## Sponsors

Thanks to these incredible sponsors for keeping rewheel going! If you'd like to sponsor this project and have your avatar or company logo appear below click [here](https://github.com/sponsors/outlandnish).

<!-- sponsors --><a href="https://github.com/daaavid"><img src="https://github.com/daaavid.png" width="60px" alt="David Johnson" /></a><a href="https://github.com/cocobailey"><img src="https://github.com/cocobailey.png" width="60px" alt="boeser" /></a><a href="https://github.com/eviston47"><img src="https://github.com/eviston47.png" width="60px" alt="" /></a><a href="https://github.com/ekarios"><img src="https://github.com/ekarios.png" width="60px" alt="" /></a><a href="https://github.com/HUKF1N"><img src="https://github.com/HUKF1N.png" width="60px" alt="" /></a><a href="https://github.com/yourjelly"><img src="https://github.com/yourjelly.png" width="60px" alt="Jon Xuereb" /></a><!-- sponsors -->
