import * as vscode from 'vscode';
// import { authenticate } from './authenticate';
// import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SideProvider';
import { TokenManger } from './TokenManger';
export function activate(context: vscode.ExtensionContext) {
	TokenManger.globalState=context.globalState;
	//adding sidebar
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	const item=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	item.text='$(beaker)Add Todo';
	item.command='vs-todo.addTodo';
	item.show();

	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"vsto-sidebar",
		sidebarProvider
	  )
	);
	// console.log('Congratulations, your extension "vs-todo" is now active!');
	 context.subscriptions.push(vscode.commands.registerCommand('vs-todo.helloWorld', () => {
		vscode.window.showInformationMessage('token'+TokenManger.getToken());
		//HelloWorldPanel.createOrShow(context.extensionUri);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('vs-todo.authenticate', () => {
		// authenticate(()=>{

		// });
	}));
	context.subscriptions.push(vscode.commands.registerCommand('vs-todo.addTodo', () => {
		   const{activeTextEditor}=vscode.window;
		   if (!activeTextEditor) {
			vscode.window.showInformationMessage('No active text editor');  
			return;
		   }
		   //get select part
		   const text=activeTextEditor.document.getText(activeTextEditor.selection);
		   sidebarProvider._view?.webview.postMessage({type:"new_todo",value:text});
		   //vscode.window.showInformationMessage('text'+text);  
	}));
	//console.log('Congratulations, your extension "vs-todo" is now active!');
	context.subscriptions.push(vscode.commands.registerCommand('vs-todo.refresh', async() => {
	  // vscode.window.showInformationMessage('Hello  from vs-todo!');
	  // HelloWorldPanel.kill();
	  // HelloWorldPanel.createOrShow(context.extensionUri);
	  await vscode.commands.executeCommand("workbench.action.closeSidebar");
	  await vscode.commands.executeCommand("workbench.view.extension.vsto-sidebar-view");
	  // setTimeout(()=>{  vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");},500); 
	}));

	context.subscriptions.push(vscode.commands.registerCommand('vs-todo.askQuestion',async()=>{
		const answer=await vscode.window.showInformationMessage('how was your day','good','bad');
		if(answer==='bad'){
			vscode.window.showInformationMessage('dacr yala fih eh');
		}else{
			vscode.window.showInformationMessage('asss');
		}
	}));

	
}

// this method is called when your extension is deactivated
export function deactivate() { }
