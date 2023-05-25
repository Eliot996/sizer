<script>
    import { BASE_URL, USER} from '../store/globalsStore.js';
    import { useNavigate } from 'svelte-navigator';
    const navigate = useNavigate();

    import toast, { Toaster } from 'svelte-french-toast';

    async function create() {
        const isCorrectPassword = document.getElementById('password-input1').value === document.getElementById('password-input2').value 
        if (!isCorrectPassword) {
            toast.error("Passwords are not the same")
            return
        }

        const loginObject = {email: document.getElementById('email-input').value,
                             password: document.getElementById('password-input1').value}
        
        const response = await fetch($BASE_URL + '/create', {
            method: 'POST',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(loginObject)
        });
        
        if (response.status !== 200) {
            toast.error("The email is likely taken");
            return;
        }
        
        const result = await response.json();
        $USER = result.userID;
        navigate('/secret');
    }
</script>

<Toaster />

<h1>Create new user</h1>
<p>
    Please enter your information below
</p>

<div>
    <div>
        <label>Email: <input type="text"id='email-input'/></label><br> 
        <label>Password: <input type="password" id="password-input1"></label><br>
        <label>Password: <input type="password" id="password-input2"></label><br>
    </div>
    <button on:click={create}>Create User</button>
</div>