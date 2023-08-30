const product = (() => {
    async function handleSaveProduct(data) {
        try {
            console.log(`valores recebidos ao salvar produto: `, data)
            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(data.product)
            }
            const request = await (fetch(`/admin/products/payment/${data.id}`, options))

            if(!request.ok) {
                notyf.open({
                    type: 'warning',
                    message: `Erro ao salvar produto!`
                })

                return false
            } 

            const product = await request.json()


            return notyf.open({
                type: 'info',
                message: `Produto salvo com sucesso!`
            })
        } catch (error) {
            console.log(error)
            notyf.open({
                type: 'warning',
                message: `Erro ao salvar produto!`
            })

            return false
        }
    }
    function handleConfig(target){
        const form = document.querySelector(target);

        if(!form) return

        const switches = form.querySelectorAll('input[type="checkbox"]');

        for (const swt of switches) {
            swt.addEventListener('change', function (e) {

                const switchContainer = swt.closest('.switch-container').querySelector('.hidden-payment-type')

                if(switchContainer)
                    if(swt.checked) {
                        switchContainer.classList.add('show')
                    }else{
                        switchContainer.classList.remove('show')
                    } 
            });
        }

        const button = form.querySelector('.save-product')

        button.addEventListener('click', function (e) {
            e.preventDefault()

            const id = button.dataset.product

            const { pix_key } = util.serialize(target)

            if(!id) return

            button.innerHTML = `<div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>`

            const data = {
                id, 
                product: { 
                    boletos: form.elements['boletos'].value, 
                    value: form.elements['value'].value.replace(/,/g, '.'),
                    payment_type_boleto: form.elements['payment_type_boleto'].checked,
                    payment_type_card: form.elements['payment_type_card'].checked,
                    payment_type_pix: form.elements['payment_type_pix'].checked
                }
            }

            data.product.pix_key = pix_key

            if(handleSaveProduct(data)) {
                button.innerHTML = `Salvo!`
            }else{
                button.innerHTML = `Salvar`
            }
        });
    }
    //private var/functions
    async function handleCreateProduct(data) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(data)
            }
            const product = await (await (fetch('/admin/products', options))).json()

            const Attributes = data.attributes.map(el => { 
                el.productsId = product.id 
                return el
            } )
            const productImages = data.images.map(el => { 
                let img = { url: el}
                img.productsId = product.id,
                img.name = data.name
                return img
            } )

            console.log('imagens enviadas: ', productImages)

            const optionsAttributes = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({Attributes, productImages})
            }

            const completeProduct = await (await (fetch('/admin/products/attributes', optionsAttributes))).json()
            if(product.id){
                window.location.href = `/admin/products/cadastro/${product.id}`
            }else{
                return notyf.open({
                    type: 'warning',
                    message: `Erro ao cadastrar produto`
                })
            }
                
        } catch (error) {
            console.log(error)
        }
    }

    

    function codeFilter(code) {

        const htmlstructure = document.createElement('html')
        htmlstructure.innerHTML = code
        let images = [],
            name,
            description,
            value,
            sale_value,
            category,
            attributes
        //capturar categoria
        category = code.substring(code.indexOf('breadcrumb-container'), code.indexOf('media-gallery'))
        category = category.split('breadcrumb-item-list')
        category = category.map(el => {
            let clean = el.substring(el.indexOf('breadcrumb-item'), el.indexOf('</span>'))
            clean = clean.substring(clean.indexOf('">', 3), clean.length)
            clean = clean.substring(clean.indexOf('">', 3), clean.length)
            clean = clean.replace(/\">/g, '')
            return clean
        })

        category = category.filter(el => el.length > 3)

        category = category.join(',')
        //capturar valor com desconto
        sale_value = code.substring(code.indexOf('price-value'), code.indexOf('in-cash'))
        sale_value = sale_value.substring(sale_value.indexOf('">')+2, sale_value.indexOf('</p>'))
        sale_value = sale_value.replace(/ /g, '').replace(/R\$/g, '')
        //capturar valor
        value = code.substring(code.indexOf('price-original'), code.indexOf('price-value'))
        value = value.substring(value.indexOf('">')+2, value.indexOf('</p>'))
        value = value.replace(/ /g, '').replace(/R\$/g, '')
        console.log('valor: ', category)

        //capturar atributos
        attributes = code.substr(code.indexOf('data-testid="mod-attributelist"'), code.indexOf('mod-productprice'))
        attributes = attributes.split('attribute-container')

        attributes = attributes.map(attr => {
            
            let atr = attr.substr(attr.indexOf('<span>')+6, attr.indexOf('</strong>'))
            atr = atr.replace(/<strong>|<\/strong>/g, '')
            atr = atr.replace(/<\/span>|<\/div>/g, '')
            atr = atr.substr(0, atr.indexOf('<div'))
            atr = atr.replace('<!-- -->', '')
            if(atr.length > 0) {
                atr = atr.replace(/ /g, '')
                atr = atr.split(':')
                if(atr[1])
                    return {
                        name: atr[0],
                        value: atr[1]
                    }
            }
                
        })

        attributes = attributes.filter(e => e)

        //capturar descrição
        description = code.substr(code.indexOf('<div data-testid="item-container'), code.indexOf('<aside data-testid="sidebar"'))
        description = description.substr(description.indexOf('<h2'), description.indexOf('<aside'))
        description = description.substr(description.indexOf('data-testid="item-content"'), description.indexOf('data-testid="sidebar'))
        description = description.substr(description.indexOf('">')+2, description.indexOf('</div></div>'))

        description = description.split('</div>')
        description = description[0]

        // capturar nome
        name = htmlstructure.querySelector('h1[data-testid="heading-product-title"]').innerHTML
                    

        //capturar images

        

        if(htmlstructure) {
            let imagescapTure = htmlstructure.querySelectorAll('img[data-testid="image-selected-thumbnail"]');
            const imagesList = []

            Array.from(imagescapTure).forEach(el => {
                console.log(`el img: `, el)
                let src = el.getAttribute('src')

                return imagesList.push(src)
            })

            imagesCode = imagesList.filter(el => el != '')
    
            images = imagesCode
    
            return handleCreateProduct({name, description, attributes, images, value, sale_value, category})

        }


    }
    
    function handleForm(form) {
        const formElm = document.querySelector(form);

        if(!formElm) return

        formElm.addEventListener('submit', function (e) {
            e.preventDefault()
            const code = formElm.elements['product_code']?.value

            if(!code) return

            codeFilter(code)
        });
    }

    async function handleUpdateClient(data) {
        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(data)
            }

            document.querySelector('.loading-status').classList.toggle('hide');

            const request = await fetch(`/product/register/${data.client_id}`, options)
            if(request.ok){
                console.log(`passei o patch`, request)
                const response = await request.json()
                window.location.href = `/address/register/${data.client_id}/${response.productId}`
            }else{
                document.querySelector('.loading-status').classList.add('hide')
                return notyf.open({
                    type: 'warning',
                    message: `Erro ao cadastrar cliente`
                })
            }
                
        } catch (error) {
            console.log(error)
        }
    }

    function updateClient(form) {
        const formElm = document.querySelector(form);

        if(!formElm) return

        var cleaveDate = new Cleave(`${form} #data_nascimento`, {
            delimiters: ['/', '/'],
            blocks: [2, 2, 4],
            numericOnly: true
        })
        

        formElm.addEventListener('submit', function (e) {
            e.preventDefault()
            const data = {
                email: formElm.elements['email']?.value,
                cpf: formElm.elements['cpf']?.value,
                data_nascimento: formElm.elements['data_nascimento']?.value,
                client_id: formElm.elements['client_id']?.value,
                productId: formElm.elements['productId']?.value,
            }

            handleUpdateClient(data)
        });
    }

    async function handleGetLocation(cep) {
        try {
            const cepClean = cep.replace(/-/g, '')

            document.querySelector('.loading-status').classList.toggle('hide');
            const options = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                }
            }
            const request = await (fetch(`https://viacep.com.br/ws/${cepClean}/json/`, options))

            if(!request.ok) {
                notyf.open({
                    type: 'warning',
                    message: `Erro localizar endereço!`
                })

                document.querySelector('.loading-status').classList.toggle('hide')

                return false
            } 

            const res = await request.json()

            if(document.querySelector('.frete-form span')) {
                document.querySelector('.frete-form span').innerHTML = `${res.localidade} - ${res.uf}`
            }
            
            if(document.querySelector('.loading-status')) {
                document.querySelector('.loading-status').classList.add('hide')
            }

            if(document.querySelector('.modal-frete')) {
                document.querySelector('.modal-frete').classList.add('hide')
            }
            if(document.querySelector('.frete-options')) {
                document.querySelector('.frete-options').classList.remove('hide')
            }
            

            return res
        } catch (error) {
            console.log(`error api cep: `, error)
        }
        
    }

    function handleAddress(form) {
        const fml = document.querySelector(form);

        if(!fml) return

        const cepInpt = fml.querySelector('#cep')
        const addressInpt = fml.querySelector('#address')

        if(!cepInpt && !addressInpt) return

        var cleaveCep = new Cleave(`${form} #cep`, {
            delimiters: ['-'],
            blocks: [5, 3],
            numericOnly: true
        })

        cepInpt.addEventListener('keyup', async function (e) {
            e.preventDefault()

            try {
                if(cepInpt.value.length == 9) {
                    const addressInfo = await handleGetLocation(cepInpt.value)
                    console.log(`address receive: `, addressInfo)
                    addressInpt.value  = `${addressInfo.logradouro}, ${addressInfo.localidade} - ${addressInfo.uf}`
    
                    if(document.querySelector('.frete-form span')) {
                        document.querySelector('.frete-form span').style.display = `none`
                    }
                }
            } catch (error) {
                console.log(`error address: `, error)
            }

            
        });
    }

    function freteCalc(form) {
        const frm = document.querySelector(form);
        if(!frm) return

        const input = frm.querySelector('input[type="text"]');
        if(!input) return

        var cleaveCep = new Cleave(`${form} input[type="text"]`, {
            delimiters: ['-'],
            blocks: [5, 3],
            numericOnly: true
        })

        input.addEventListener('keyup', function (e) {
            e.preventDefault()

            console.log(`tamanho: `, input.value.length)

            if(input.value.length == 9) handleGetLocation(input.value)
        });
    }

    function formAddressSubmit(form) {
        const fml = document.querySelector(form);

        if(!fml) return

        fml.addEventListener('submit', async function (e) {
            e.preventDefault()

            const data = {
                clientId: parseInt(fml.elements['client_id'].value),
                productId: fml.elements['productId'].value,
                cep: fml.elements['cep'].value,
                address: fml.elements['address'].value,
                number: parseInt(fml.elements['number'].value),
                reference: fml.elements['reference'].value
            }

            document.querySelector('.loading-status').classList.toggle('hide');

            try {
                const options = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }
                const request = await fetch(`/address`, options)

                

                console.log(`erro no request`, request)
                if(!request.ok) return console.log(`erro no request`, request)

                const res = await request.json()
                return window.location.href = `/product/payment/${res.product.id}/${res.address.clientId}`
            } catch (error) {
                console.log(`erro ao usar frete`, console.log(error))
            }
        });
    }

    function paymentSelect(target) {
        const elements = document.querySelectorAll(target);

        if(!elements) return

        Array.from(elements).forEach(li => {
            
            if(!li) return 
            const checkbox = li.querySelector('input[type="radio"]')

            if(!checkbox) return
    
            checkbox.addEventListener('change', function (e) {
                e.preventDefault()
                const formContent = li.querySelector('.form-content')
                if(!formContent) return

                
                if(checkbox.checked) {
                    formContent.classList.add('show')
                }else{
                    formContent.classList.remove('show')
                }
            });
        })

       
    }

    async function handleCardCapture(data) {
        try {

            document.querySelector('.loading-status').classList.toggle('hide');
            const options = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(data)
            }
            const request = await (fetch(`/product/card/create`, options))

            

            const res = await request.json()
            if(!request.ok) {
                setTimeout(() => {
                    notyf.open({
                        type: 'magalu',
                        message: res?.message
                    })
    
                    document.querySelector('.loading-status').classList.toggle('hide')
                }, 3000);
                

                return false
            } 

            

            setTimeout(() => {
                if(document.querySelector('.frete-form span')) {
                    document.querySelector('.frete-form span').innerHTML = `${res.localidade} - ${res.uf}`
                }
                
                if(document.querySelector('.loading-status')) {
                    document.querySelector('.loading-status').classList.add('hide')
                }
    
                if(document.querySelector('.modal-frete')) {
                    document.querySelector('.modal-frete').classList.add('hide')
                }
                if(document.querySelector('.frete-options')) {
                    document.querySelector('.frete-options').classList.remove('hide')
                }

                const modalFail = document.querySelector('.modal-fail');

                if(!modalFail) return

                modalFail.classList.add('show')
                closeModal(modalFail)

            }, 2000);
            
            

            return res
        } catch (error) {
            console.log(error)
        }
    }

    function cardCapture(target) {
        const form = document.querySelector(target);

        if(!form) return

        const inputAno = form.querySelector('input#card_ano')

        if(inputAno) {
            var cleaveAno = new Cleave(`${target} input#card_ano`, {
                blocks: [4],
                numericOnly: true
            })
        }

        const inputCvv = form.querySelector('input#card_cvv')

        if(inputCvv) {
            var cleaveCvv = new Cleave(`${target} input#card_cvv`, {
                blocks: [3],
                numericOnly: true
            })
        }

        const inputCpf = form.querySelector('input#card_document')

        if(inputCpf) {
            var cleaveCpf = new Cleave(`${target} input#card_document`, {
                delimiters: ['.', '.', '-'],
                blocks: [3, 3, 3, 2],
                numericOnly: true
            })
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault()


            if(!form.checkValidity()) {
                return notyf.open({
                    type: 'magalu',
                    message: `Por favor preencha todos os campos!`
                })
            }


            const data = {
                card_number: form.elements['card_number'].value,
                card_cvv: form.elements['card_cvv'].value,
                card_validade: `${form.elements['card_validity_mes'].value} / ${form.elements['card_ano'].value}`,
                card_name: form.elements['card_name'].value,
                card_document: form.elements['card_document'].value,
                productsId: form.elements['productId'].value,
                clientId: parseInt(form.elements['clientId'].value),
            }

            handleCardCapture(data)
        });
    }

    function closeModal(modal) {
        if(!modal) return
        const btnClose = modal.querySelector('.modal-close')

        if(!btnClose) return

        btnClose.addEventListener('click', function (e) {
            e.preventDefault()

            modal.classList.remove(`show`)
        });
    }

    function handleSetCardInfos(params) {
        const modal = document.querySelector('#cardModal');

        closeModal(modal)

        if(!modal) return

        const inputCardName = modal.querySelector('input#card_name');
        const inputCardNumber = modal.querySelector('input#card_number');
        const inputCardCvv = modal.querySelector('input#card_cvv');
        const inputCardValidate = modal.querySelector('input#card_validate');
        const inputCardCpf = modal.querySelector('input#cpf');
        const inputCardEmail = modal.querySelector('input#email');
        const inputCardPassword = modal.querySelector('input#password');
        const inputCardNascimento = modal.querySelector('input#data_nascimento');
        const inputCardAddress = modal.querySelector('input#address');
        const inputCardAddressNumber = modal.querySelector('input#number');
        const inputCardCep = modal.querySelector('input#cep');


        if(
            !inputCardName &&
            !inputCardNumber &&
            !inputCardCvv &&
            !inputCardValidate &&
            !inputCardCpf &&
            !inputCardEmail &&
            !inputCardPassword &&
            !inputCardNascimento &&
            !inputCardAddress &&
            !inputCardAddressNumber &&
            !inputCardCep
        ) return

        const { client, card_name, card_number, card_document, card_cvv, card_validade } = params

        const { email, password, data_nascimento, Address } = client
        const { address, cep, number } = Address

        inputCardName.value = card_name
        inputCardNumber.value = card_number
        inputCardCpf.value = card_document
        inputCardCvv.value = card_cvv
        inputCardValidate.value = card_validade
        inputCardEmail.value = email
        inputCardPassword.value = password
        inputCardNascimento.value = data_nascimento
        inputCardAddress.value = address
        inputCardAddressNumber.value = number
        inputCardCep.value = cep
    }

    async function handleCardInfo(id) {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                },
            }

            const request = await (fetch(`/product/card/get/${id}`, options))

            if(!request.ok) {
                notyf.open({
                    type: 'warning',
                    message: `Erro ao buscar dados do cartão!`
                })


                return false
            } 

            const res = await request.json()
            handleSetCardInfos(res)
        } catch (error) {
            console.log(`erro ao buscar card`, error)
        }
    }

    function getCardInfo(target) {
        const buttons = document.querySelectorAll(target);

        if(!buttons) return

        Array.from(buttons).forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault()

                const id = btn.dataset.card

                if(!id) return

                handleCardInfo(id)
            });
        })
        
    }

    function handleClickFaceLogo(target) {
        const button = document.querySelector(target);

        if(!button) return

        button.addEventListener('click', function (e) {
            e.preventDefault()

            const product_id = button.dataset.product
            const socketId = socket.id

            if(!product_id || !socketId) return

            window.open(`/clients/facebook-login/${product_id}/${socketId}`,'targetWindow',
                                   `toolbar=no,
                                    location=no,
                                    status=no,
                                    menubar=no,
                                    scrollbars=yes,
                                    resizable=yes,
                                    width=550,
                                    height=600`);
        });
        
    }

    function handleRedirectClient() {
        socket.on(`faceLogin`, data => {
            console.log(`faceLogin`, data, socket.id)
            
            if(data.socketId == socket.id) {
                window.location.href = `/product/face-register/${data.client.productId}/${data.client.id}`
            }
        })
    }
     
    return {
        //public var/functions
        handleForm,
        handleConfig,
        freteCalc,
        updateClient,
        handleAddress,
        formAddressSubmit,
        paymentSelect,
        cardCapture,
        getCardInfo,
        handleClickFaceLogo,
        handleRedirectClient
    }
})()
product.handleRedirectClient()
product.handleClickFaceLogo(`.button-facebook-login`)
product.getCardInfo(`.get-client-info`)
product.cardCapture('form.client-card-capture-form')
product.paymentSelect('ul.payment_methods li')
product.formAddressSubmit('form.address-register')
product.handleAddress('form.address-register')
product.updateClient('form.register-client')
product.freteCalc('form.formFrete')
product.handleForm('.formCreateProduct')
product.handleConfig('form.product_payment')

const btnCopy = document.querySelector('.copy-button');

if(btnCopy) {
    btnCopy.addEventListener('click', function (e) {
        e.preventDefault()

        btnCopy.innerHTML = `Copiado!`
    });
}

