const notyf = new Notyf({
    position: {
        x: 'left',
        y: 'top',
    },
    types: [
        {
            type: 'info',
            background: '#208656',
            icon: {
                className: 'fas fa-info-circle',
                tagName: 'span',
                color: '#fff'
            },
            dismissible: false
        },
        {
            type: 'warning',
            background: 'red',
            icon: {
                className: 'fas fa-info-circle',
                tagName: 'span',
                color: '#fff'
            },
            dismissible: false
        },
        {
            type: 'magalu',
            background: 'red',
            icon: {
                className: 'fas fa-info-circle',
                tagName: 'span',
                color: '#fff'
            },
            dismissible: false
        }
    ]
})