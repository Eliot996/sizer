<script>
    import { BASE_URL, USER} from '../store/globalsStore.js';
    import { useNavigate } from 'svelte-navigator';
    const navigate = useNavigate();

    import toast, { Toaster } from 'svelte-french-toast';

    async function login() {
        const loginObject = {email: document.getElementById('email-input').value,
                             password: document.getElementById('password-input').value}
        
        const response = await fetch($BASE_URL + '/login', {
            method: 'POST',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(loginObject)
        });
        
        if (response.status !== 200) {
            toast.error("Wrong password or email");
            return;
        }
        
        const result = await response.json();
        $USER = result.userID;
        navigate('/shoes');
    }
</script>

<Toaster />

<h1>Welcome</h1>
To Sizer, we aim to help you find fitting shoes, without trying them on!
{#if !$USER}
<p>
    Please sign in before continuing
</p>

<div>
    <div>
        <label>Email: <input type="text"id='email-input'/></label><br> 
        <label>Password: <input type="password" id="password-input"></label><br>
    </div>
    <button on:click={login}>login</button>
</div>
{/if}