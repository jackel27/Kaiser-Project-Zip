# Kaiser's Project Zip

**Kaiser's Project Zip** is a Visual Studio Code extension that enables you to zip your entire project excluding files and directories specified in your `.gitignore`. This makes it easy to pack up your project for sharing or deployment, while avoiding unwanted files.

## Features

- **Zip your entire project**: Just run the `Zip Project` command from the Command Palette (`F1` or `View > Command Palette`) and select your workspace folder. The extension will create a `project.zip` file in the parent directory of your workspace.

- **Exclude files and directories**: The extension reads your `.gitignore` file and excludes all matched files and directories when creating the zip file. This allows you to avoid including unwanted files, such as node_modules, log files, caches, etc.

## Usage

1. Open the Command Palette (`F1` or `View > Command Palette`).
2. Type `Zip Project` and hit `Enter`.
3. Select your workspace folder.
4. The extension will create a `project.zip` file in the parent directory of your workspace, excluding files and directories specified in your `.gitignore`.

## Installation

You can install this extension from the Visual Studio Code Marketplace. Alternatively, you can download the `.vsix` file and install it manually via `Install from VSIX...` in the Extensions view.

## Issues & Contributions

If you find any issues or have suggestions, please [file an issue](https://github.com/username/repo/issues) on GitHub. Contributions are also welcome!

## Contact

If you have any questions or comments, feel free to contact me at [davidcorykaiser@gmail.com](mailto:davidcorykaiser@gmail.com).

## License

MIT
