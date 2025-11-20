import { useState } from 'react'

const useField = (initial) => {
    const [value, setValue] = useState(initial)

    const onChange = (newValue) => {
        setValue(newValue)
    }
}

export default {
    value, onChange
}
