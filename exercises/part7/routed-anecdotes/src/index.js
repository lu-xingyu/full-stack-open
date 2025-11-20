import { useState } from 'react'

const useField = (initial, type) => {
    const [value, setValue] = useState(initial)

    const set = (newValue) => {
        setValue(newValue)
    }

    return {
        type,
        value,
        set
    }
}


export default useField
