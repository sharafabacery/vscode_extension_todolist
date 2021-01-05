<script lang='ts'>
import { onMount } from "svelte";
import type { User } from "../types";
export let user:User
let todos:Array<{text:String,completed:boolean,id:number}>=[];
export let accessToken:string
let text='';
async function markasComplete(t:number){
    const response=await fetch(`${apiBaseUrl}/todo`,{
        method:"PUT",
        body:JSON.stringify({id:t}),
        headers:{'content-type':"application/json",
            authorization:`Brearer ${accessToken}`}
    })
    const {todo}=await response.json()
    todos=[todo,...todos]
}
async function addTodo(t:string) {
    const response=await fetch(`${apiBaseUrl}/todo`,{
        method:"POST",
        body:JSON.stringify({text:t}),
        headers:{'content-type':"application/json",
            authorization:`Brearer ${accessToken}`}
    })
    const {todo}=await response.json()
    todos=[todo,...todos]
}
onMount(async()=>{
        //get ex message to webview
        window.addEventListener('message',async event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'new_todo':
                addTodo(message.value);
                break;
           
        }
})
const response=await fetch(`${apiBaseUrl}/todo`,{
        method:"GET",
        
        headers:{
            authorization:`Brearer ${accessToken}`}
    })
    const paylod=await response.json()
    todos=paylod.todos
});
</script>
<style>
   .complete{
       text-decoration: line-through;
   }
</style>
<div>hellow: {user.name}</div>
<form on:submit|preventDefault={async()=>{
    //todos=[{text,completed:false},...todos]
    addTodo(text)
    text=''
}}>
    <input bind:value={text}/>
    
</form>

<ul>
    {#each todos as todo (todo.id)}
        <li on:click={()=>{todo.completed=!todo.completed
        markasComplete(todo.id);
        }} class:complete={todo.completed}>{todo.text}</li>
    {/each}
</ul>
