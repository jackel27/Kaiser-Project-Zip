import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import ignore from 'ignore';
import * as glob from 'glob';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.zipProject', async () => {
        const folderUri = await vscode.window.showWorkspaceFolderPick();
        if (!folderUri) {
            vscode.window.showErrorMessage('No folder selected');
            return;
        }

        const folderPath = folderUri.uri.fsPath;
        const gitignorePath = path.join(folderPath, '.gitignore');
        const outputPath = path.join(folderPath, 'project.zip');

        if (fs.existsSync(outputPath)) {
            const overwrite = await vscode.window.showWarningMessage('A file named "project.zip" already exists. Do you want to overwrite it?', { modal: true }, 'Overwrite');
            if (overwrite !== 'Overwrite') {
                return;
            }
        }

        vscode.window.showInformationMessage('Zipping project...');

        const ignoreFilter = getIgnoreFilter(gitignorePath);
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip');

        output.on('close', function () {
            vscode.window.showInformationMessage(`Zipped project has been saved to ${outputPath}`);
        });

        archive.pipe(output);

        await addFilesToArchive(archive, ignoreFilter, folderPath);

        await finalizeArchive(archive);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

function getIgnoreFilter(gitignorePath: string): ReturnType<typeof ignore> {
    const ignoreFilter = ignore();
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath).toString();
        ignoreFilter.add(gitignoreContent);
    }
    return ignoreFilter;
}


async function addFilesToArchive(archive: archiver.Archiver, ignoreFilter: ReturnType<typeof ignore>, folderPath: string) {
    return new Promise((resolve, reject) => {
        glob('**/*', { cwd: folderPath, dot: true, absolute: true, nodir: true }, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            for (const filePath of files) {
                const relativePath = path.relative(folderPath, filePath);
                if (!ignoreFilter.ignores(relativePath)) {
                    archive.append(fs.createReadStream(filePath), { name: relativePath });
                }
            }

            resolve(null);
        });
    });
}

async function finalizeArchive(archive: archiver.Archiver) {
    return new Promise((resolve, reject) => {
        archive.on('error', reject);
        archive.finalize().then(resolve, reject);
    }).catch((error) => {
        vscode.window.showErrorMessage(`Error creating zip file: ${error.message}`);
    });
}
