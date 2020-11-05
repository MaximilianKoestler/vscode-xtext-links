import * as vscode from "vscode";
import * as os from "os";

// match "ERROR:Something has gone wrong. (file:/C:/SomeDir/src/main.mydsl line : 30 column : 4)"
const pattern = /\(((?<path>[^\)]+) line : (?<line>\d+)( column : (?<column>\d+))?)\)/;

export function activate(_context: vscode.ExtensionContext) {
  vscode.window.registerTerminalLinkProvider({
    provideTerminalLinks: (context, _token) => {
      let links = [];

      const regex = new RegExp(pattern, "g");
      let match;
      while ((match = regex.exec(context.line)) !== null) {
        links.push({
          startIndex: match.index + 1,
          length: match[1].length,
          tooltip: "Open Xtext message source",
          data: {
            path: match.groups?.path,
            line: match.groups?.line,
            column: match.groups?.column,
          },
        });
      }
      return links;
    },

    handleTerminalLink: (link: any) => {
      let path = (link.data.path as string).startsWith("file:")
        ? vscode.Uri.parse(link.data.path)
        : vscode.Uri.file(link.data.path);

      vscode.workspace.openTextDocument(path).then((document) => {
        vscode.window.showTextDocument(document).then((editor) => {
          let line = Math.max(parseInt(link.data.line || 1) - 1, 0);
          let column = Math.max(parseInt(link.data.column || 1) - 1, 0);
          editor.revealRange(new vscode.Range(line, column, line, column));
          editor.selection = new vscode.Selection(line, column, line, column);
        });
      });
    },
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
