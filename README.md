# Better Datapack for Minecraft
Same datapacks. Better execution.

# How to use?
Write your code as you wish. Once you got to a point where you would like to check in-game just open the Command Palette (`Ctrl + Shift + P`), type `convert` and hit `[Enter]`. A new, runnable datapack should be created next to the project's folder in `bdout`, or at the specified location in `bdconfig.json`.

# Features
Here are all the features it gives. The Config file is necessary!

## Config
You can configurate the converting process by creating a `bdconfig.json` file at the root of your project. If you don't have this file then the extension will use the default config.

* outputPath - Determines the location where the datapack will be outputted. By default it goes next to your project with the name `bdout`

```json
{
  "outputPath": "path/to/the/output/directory"
}
```

## Multiline commands (1.0.0)
You no longer need to cram long complex commands in a single line. However you will need to use slashes at the start of every single one.

# Links:
Source code on [Github](https://github.com/ExAtom/BetterDatapack)

Inspiration and similar projects: [Mr. Garretto's Command Combiner Pro](https://mrgarretto.com/cmdcombinerpro/), [Trident](https://discord.gg/VpfA3c6)
