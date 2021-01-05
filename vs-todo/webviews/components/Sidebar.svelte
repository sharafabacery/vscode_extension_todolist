<script lang='ts'>
import { onMount } from "svelte";
import type { User } from "../types";
import Todos from "./Todos.svelte";

let loading=true
let user:User|null=null
let accessToken:string=""

let page :'todos'|'contact'=tsvscode.getState()?.page||'todos';
$:{
    tsvscode.setState(page)
}
onMount(async()=>{
        //get ex message to webview
        window.addEventListener('message',async event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
             case 'token':
               accessToken=message.value
                console.log(accessToken)
                const response=await fetch(`${apiBaseUrl}/me`,{headers:{authorization:`Brearer ${accessToken}`}});
                
                const data=await response.json()
                console.log(data)
                user=data.user
                loading=false
                break;
        }
});
tsvscode.postMessage({type:'get-token',value:undefined});

})
</script>

{#if loading }
<div>Loading.....</div>

{:else if user }
{#if page==='todos'}
 <Todos {user} {accessToken}/> 
 <button on:click={()=>{page='contact'}}>gocontact</button>
 {:else}
 <div> contact me :abacerysharaf@gmail.com</div> 
 <button on:click={()=>{page='todos'}}>goback</button>
{/if}

<button on:click={()=>{
    accessToken="";
    user=null
    tsvscode.postMessage({type:'logout',value:undefined});
}}>Logout</button>
{:else}
<div>no user  is logged in</div>
<button  on:click={()=>{
    tsvscode.postMessage({type:"authenticate",value:undefined});
}}>loginWithGithub</button>
{/if}
