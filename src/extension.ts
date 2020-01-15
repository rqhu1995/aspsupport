// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
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
      let suffix = "";
      let suf3 = vscode.window
        .showQuickPick(["当前lp文件", "选择当前目录下lp文件"], {
          canPickMany: false,
          ignoreFocusOut: true,
          matchOnDescription: true,
          matchOnDetail: true,
          placeHolder: "选择clingo执行范围"
        })
        .then(function(user_choice) {
          // console.log(user_choice);
          if (user_choice === "当前lp文件") {
            if (
              vscode.window.activeTextEditor?.document.uri.path !== undefined
            ) {
              suffix = vscode.window.activeTextEditor?.document.uri.path
                .split(" ")
                .join("\\ ");
              return suffix;
            }
          } else {
            let cwd = vscode.workspace.workspaceFolders;
            let filename_list: string[] = [];
            let choices = "";
            // 获取该目录下全部文件名，存入filename_list中
            if (cwd !== undefined) {
            let suf2 =  vscode.workspace.fs
                .readDirectory(cwd[0].uri)
                .then(function(arrays) {
                  for (const arr of arrays) {
                    if (arr[0].endsWith("lp")) {
                      filename_list.push(arr[0]);
                    }
                  }
                  console.log(filename_list);
                  // console.log(prefix + '\/' + arr[0] + ' ');
                  let suf = vscode.window
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
                      return choices;
                    });
                    return suf;
                });
                return suf2;
            }
          }
        });
        
        suf3.then(function(id) {
          console.log('id' + id);
          if(id !== undefined){
            suffix = id;
            // console.log(res);
            terminal.show(true);
            terminal.sendText("clingo 0 " + suffix);
          }
        });

          // Display a message box to the user
          vscode.window.showInformationMessage("terminal shown!");
        });

      context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
export function deactivate() {}
