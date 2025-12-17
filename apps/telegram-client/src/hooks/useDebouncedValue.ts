
import { useEffect, useState } from "react"

export default function useDebouncedValue<T>(val: T, delay: number) {
    const [debounced, setDebounced] = useState<T>(val);

    useEffect(() => {
        const debouncedTimeout = setTimeout(() => setDebounced(val), delay)
        return () => clearTimeout(debouncedTimeout)
    }, [val, delay])

    return debounced
}