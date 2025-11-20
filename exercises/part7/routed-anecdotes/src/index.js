import { useState } from 'react'

const useField = (initial) => {
    const [value, setValue] = useState(initial)

    const onChange = (newValue) => {
        setValue(newValue)
    }

    return {
        value,
        onChange
    }
}


export default useField
