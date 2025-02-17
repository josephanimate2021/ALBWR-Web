# A Link Between Worlds Randomizer

A randomizer program for The Legend of Zelda: A Link Between Worlds. Requires a North American `.3ds` file dumped from a 3DS. A guide for dumping cartridges can be found here: <https://citra-emu.org/wiki/dumping-game-cartridges/>.

## Installation and usage

Once you have downloaded the release appropriate for your platofrm, extract `albw-randomizer.exe` (or equivalent) to a folder on your system.

On Windows, use `Windows` + `R`, type `cmd`, and hit `Enter` to open a command line program.

```cmd
cd <folder of extracted exe>
./albw-randomizer
```

On first run, you will be prompted for the location of your `.3ds` file and an output directory. Use

```cmd
./albw-randomizer -v
```

to get more output. Use

```cmd
./albw-randomizer --seed <seed>
```

for fixed seeds.

For use on 3DS hardware, copy `00040000000EC300` to `/luma/titles` on your SD card. Ensure that `Enable game patching` is selected in Luma's config (this can be opened by holding `Select` when powering on the console).

For use in Citra, you must copy the folder to `<Citra folder>/load/mods/`. You can find the Citra folder by selecting `File > Open Citra folder...` in Citra.

## Acknowledgements

Special thanks to my beta testers:

* AeroRaiser
* benstephens56
* Dawn
* Herreteman
* Photon
* romulost
* TheFercracker

## License

This program is licensed under the GNU General Public License v2.0.
