import * as vscode from 'vscode';
const key='vstodotoken';
export class TokenManger{
    static globalState:vscode.Memento;
    static setToken(token:string){
      return  this.globalState.update(key,token);
    }
    static getToken():string|undefined{
        return this.globalState.get(key);
    }
}