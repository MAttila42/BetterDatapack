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

## Function declaration (1.2.0)
Most programming languages support this, but in Minecraft you have to make a new file to have a different function. Since BD 1.2.0, you can declare functions inside functions like this: `/mcfunction <function_name> { <code> }`. If it was declared in custom:main, then you can call the new one like so: custom:main/function_name.

Example:
![Code example](https://cdn.discordapp.com/attachments/825442308203479071/825455411033276436/unknown.png)

Functions cannot be nested. You can call the function anywhere from the code.

## Multiline commands (1.0.0)
You no longer need to cram long complex commands in a single line. However you will need to use slashes at the start of every single one. Start of the commands also must start at the beggining of the line. I recommend using an understandable and uniform format.

Example:
![Code example](https://cdn.discordapp.com/attachments/825442308203479071/825442335860195378/unknown.png)

# Links:
Source code on [Github](https://github.com/ExAtom/BetterDatapack)

Inspiration and similar projects: [Mr. Garretto's Command Combiner Pro](https://mrgarretto.com/cmdcombinerpro/), [Trident](https://discord.gg/VpfA3c6)
