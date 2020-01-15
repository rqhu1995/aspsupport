// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "aspsupport" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.aspsupport",
    () => {
      // The code you place here will be executed every time your command is executed
      let terminal = vscode.window.createTerminal("clingo");
      let filename = "";
      if (vscode.workspace.workspaceFolders !== undefined) {
        filename = vscode.workspace.workspaceFolders[0].uri.path;
      }

      let prefix = filename.split(" ").join("\\ ");
      vscode.window
        .showQuickPick(["当前lp文件", "完整目录lp文件"], {
          canPickMany: false,
          ignoreFocusOut: true,
          matchOnDescription: true,
          matchOnDetail: true,
          placeHolder: "选择clingo执行范围"
        })
        .then(function(user_choice) {
          // console.log(user_choice);
          if (user_choice === "当前lp文件") {
            terminal.sendText(
              "clingo 0 " +
                vscode.window.activeTextEditor?.document.uri.path
                  .split(" ")
                  .join("\\ ")
            );
          } else {
            let cwd = vscode.workspace.workspaceFolders;
            let filename_list: string[] = [];
            let choices = "";
            // 获取该目录下全部文件名，存入filename_list中
            if (cwd !== undefined) {
              vscode.workspace.fs
                .readDirectory(cwd[0].uri)
                .then(function(arrays) {
                  for (const arr of arrays) {
                    if (arr[0].endsWith("lp")) {
                      filename_list.push(arr[0]);
                    }
                  }
                  console.log(filename_list);
                  // console.log(prefix + '\/' + arr[0] + ' ');
                  vscode.window
                    .showQuickPick(filename_list, {
                      canPickMany: true,
                      ignoreFocusOut: false,
                      matchOnDescription: true,
                      matchOnDetail: true,
                      placeHolder: "选择需要包含的文件"
                    })
                    .then(function(choice_list) {
                      if (choice_list !== undefined) {
                        for (const choice of choice_list) {
                          choices = choices + prefix + "/" + choice + " ";
                        }
                      }
                      terminal.sendText("clingo 0 " + choices);
                    });
                });
            }
          }

          // console.log(res);

          terminal.show(true);
          // Display a message box to the user
          vscode.window.showInformationMessage("terminal shown!");
        });

      context.subscriptions.push(disposable);
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
