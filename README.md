# Better Datapack for Minecraft
Same datapacks. Better execution.

# How to use?
Write your code as you wish. Once you got to a point where you would like to check in-game just click on the Convert button in the top right corner of the editor while in an mcfunction file. Or alternatively use the `convert` command in the Command Palette (`Ctrl + Shift + P`). A new, runnable datapack should be created next to the project's folder in `bdout`, or at the specified location in `bdconfig.json`.

# Features
Here are all the features it gives. The Config file isn't necessary.

## Config
You can configure the converting process by creating a `bdconfig.json` file at the root of your project. If you don't have this file then the extension will use default values.

* outputPath - Determines the location where the datapack will be outputted. By default it goes next to your project with the name `bdout`

```json
{
  "outputPath": "path/to/the/output/directory"
}
```

## Multiline commands (1.0.0)
You no longer need to cram long complex commands in a single line. However you will need to use slashes at the start of each one. They also must start at the beggining of the line. I recommend using an understandable and uniform format.

Example:

![Code example](https://cdn.discordapp.com/attachments/825442308203479071/843123400351940608/unknown.png)

## Function declaration (1.2.0)
Most programming languages support this, but in Minecraft you have to make a new file to have a different function. Since BD 1.2.0, you can declare functions inside functions like this: `/mcfunction <function_name> { <code> }`. If it was declared in custom:main, then you can call the new one like so: custom:main/function_name.

Example:

![Code example](https://cdn.discordapp.com/attachments/825442308203479071/843123479866900541/unknown.png)

Functions cannot be nested. You can call the function anywhere from the code.

## Multi-command executes (1.3.0)
It can be frustrating trying to find an applauseable method to run multiple commands when an execute condition is true. In BD 1.3+ if you put braces after `run` you will be able to put as many commands in there as you wish.

Example:

![Code example](https://cdn.discordapp.com/attachments/825442308203479071/843123559055228938/unknown.png)

# Links:
For support join my [Discord server](https://discord.gg/kembxGyb2x)

Source code on [Github](https://github.com/ExAtom/BetterDatapack)

Inspiration and similar projects: [Command Combiner Pro](https://mrgarretto.com/cmdcombinerpro/), [Trident](https://discord.gg/VpfA3c6)
