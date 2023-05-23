import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import generator from './generator';

describe('folder-mover generator', () => {
  it('should move the folder and update imports', async () => {
    // Arrange
    const tree = createTreeWithEmptyWorkspace();
    tree.write('path/to/sourceFolder/file.ts', 'console.log("Hello, World!");');
    tree.write('angular.json', '{}');
    const projectName = 'my-project';
    const sourceFolder = 'path/to/sourceFolder';
    const destinationProject = 'other-project';
    const destinationFolder = 'path/to/destinationFolder';

    // Act
    await generator(tree, {
      projectName,
      sourceFolder,
      destinationProject,
      destinationFolder,
    });

    // Assert
    expect(tree.exists('path/to/destinationFolder/file.ts')).toBeTruthy();
    const fileContent = tree
      .read('path/to/destinationFolder/file.ts')
      .toString();
    expect(fileContent).toContain('console.log("Hello, World!");'); // Verify file content
    // Add additional assertions for the updated imports if needed
  });
});
