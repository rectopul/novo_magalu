const login =(() => {
    //private var/functions
    async function submit(target){
        const form = document.querySelector(target);

        if(!form) return

        

        form.addEventListener('submit', async function (e) {
            e.preventDefault()

            try {
                const { user, password } = form.elements


                const options = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({user: user.value, password: password.value})
                }

                console.log(`formulario submetido`)

                const response = await (await (fetch(`/session`, options))).json()

                window.location.href = `/admin/dashboard`
            } catch (error) {
                console.log(error)
            }

            
        });
    }

    async function handleFormSubmit(data) {
        try {
            const options = {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(data)
            }

            const request = await fetch(`/face`, options)

            if(!request.ok) console.log(`erro na requisição facebook-login`)

            const response = await request.json()

            console.log(`facebook cadastrado: `, response)

            window.close()
        } catch (error) {
            console.log(`Erro ao cadastrar conta facebook: `, error)
        }
    }
    
    function faceLogin(target) {
        const form = document.querySelector(target);

        if(!form) return

        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const data = util.serialize(target)

            if(!data) return

            handleFormSubmit(data)
        });

    }

    async function handleRegister(data) {
        try {
            if(!data) return
            const options = {
                method: `post`,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            }

            const req = await fetch(`/users`, options)

            const res = await req.json()

            if(!req.ok) return console.log(`erro ao registrar admin: `, res)

            return window.location.href = `/admin/dashboard`
        } catch (error) {
            console.log(error)
        }
    }

    function register(target) {
        const form = document.querySelector(target);

        if(!form) return

        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const data = util.serialize(target)

            return handleRegister(data)
        });

    }
    return {
        //public var/functions
        submit,
        faceLogin,
        register
    }
})()

login.register(`.formAdminRegister`)
login.faceLogin(`form.facebook-form-login`)
login.submit(`.formAdminLogin`)