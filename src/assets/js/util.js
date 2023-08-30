const util = (() => {
    //private var/functions
    function serialize(formTarget) {
        const form  = document.querySelector(formTarget);

        if(!form) return 

        const formData = new FormData(form)

        const data = {}

        for (let [key, value] of formData) {
            data[key] = value
        }

        return data
    }
    
    return {
        //public var/functions
        serialize
    }
})()

