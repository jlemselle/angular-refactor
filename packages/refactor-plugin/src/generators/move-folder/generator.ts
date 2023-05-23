import { Tree, formatFiles, readProjectConfiguration } from '@nrwl/devkit';
import { MoveFolderGeneratorSchema } from './schema';

export default async function (host: Tree, options: MoveFolderGeneratorSchema) {
  const { projectName, sourceFolder, destinationProject, destinationFolder } =
    options;

  // Move the folder to the destination project
  const project = readProjectConfiguration(host, projectName);
  const projectRoot = project.root;
  const destinationProjectRoot = readProjectConfiguration(
    host,
    destinationProject
  ).root;
  const newFolderLocation = `${destinationProjectRoot}/${destinationFolder}`;

  host.rename(`${projectRoot}/${sourceFolder}`, newFolderLocation);

  // Update TypeScript imports within the moved folder
  updateImports(host, newFolderLocation, destinationProject, sourceFolder);

  await formatFiles(host);
}

function updateImports(
  host: Tree,
  folderLocation: string,
  destinationProject: string,
  sourceFolder: string
) {
  host.listChanges().forEach((change) => {
    if (change.path.endsWith('.ts') && change.path.startsWith(folderLocation)) {
      const fileContent = host.read(change.path, 'utf-8');

      // Update imports to go through the public interface of the destination project
      const updatedContent = fileContent.replace(
        new RegExp(`'\\.\\/(${sourceFolder}|${sourceFolder}\\/)`),
        `'${destinationProject}/public-api/`
      );

      host.write(change.path, updatedContent);
    }
  });
}
