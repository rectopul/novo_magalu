const freteOpenModal = document.querySelector('.frete-form');

if(freteOpenModal) {
    freteOpenModal.addEventListener('click', function (e) {
        e.preventDefault()

        document.querySelector('.modal-frete').classList.toggle('hide')
    });
}
const freteCloseModal = document.querySelector('.close-modal');

if(freteCloseModal) {
    freteCloseModal.addEventListener('click', function (e) {
        e.preventDefault()

        document.querySelector('.modal-frete').classList.toggle('hide')
    });
}

const user = (() => {
    //private var/functions
    let changePasswordModal
    if(document.querySelector('#changePasswordModal')) {
        changePasswordModal = new bootstrap.Modal('#changePasswordModal', {
            backdrop: 'static'
        })
    }
    

    function changePassword(target) {
        const form = document.querySelector(target);

        if(!form) return

        form.addEventListener('submit', async function (e) {
            try {
                e.preventDefault()

                const data = client.getFormData(form)

                if(!data.password) return notyf.open({
                    type: 'warning',
                    message: `Preencha a nova senha`
                })

                var options = {
                    method: 'PATCH',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(data),
                };

                const user = await (await fetch("/users", options)).json()

                notyf.open({
                    type: 'info',
                    message: `Senha para o usuário ${user.name} alterada com sucesso`
                })

                changePasswordModal.hide()
            } catch (error) {
                console.log(error)
            }
        });
    }
    
    return {
        //public var/functions
        changePassword
    }
})()

user.changePassword(`.form-change-password`)
//form-change-password

