// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "xtext-links" is now active!');

  vscode.window.registerTerminalLinkProvider({
    provideTerminalLinks: (context, token) => {
      // Detect the first instance of the word "test" if it exists and linkify it
      const startIndex = (context.line as string).indexOf("test");
      if (startIndex === -1) {
        return [];
      }
      // Return an array of link results, this example only returns a single link
      return [
        {
          startIndex,
          length: "test".length,
          tooltip: "Show a notification",
          // You can return data in this object to access inside handleTerminalLink
          data: "Example data",
        },
      ];
    },
    handleTerminalLink: (link: any) => {
      vscode.window.showInformationMessage(
        `Link activated (data = ${link.data})`
      );
    },
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
