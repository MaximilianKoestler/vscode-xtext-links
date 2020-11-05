import * as vscode from "vscode";
import * as os from "os";

// match "ERROR:Something has gone wrong. (file:/C:/SomeDir/src/main.mydsl line : 30 column : 4)"
const pattern = /\(((?<path>.*) line : (?<line>\d+)( column : (?<column>\d+))?)\)/;

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
      vscode.window.showInformationMessage(
        `Link activated (data = ${link.data.path})`
      );
    },
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
