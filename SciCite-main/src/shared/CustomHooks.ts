//Hook triggered by window size/change
import { useEffect, useState } from "react"

const getIsMobile = () => {
    return window.innerWidth < 920
}

export default function useWindow() {
    const [isMobile, setIsMobile] = useState(getIsMobile)

    useEffect(() => {
        const resizeWindow = () => {
            setIsMobile(getIsMobile)
        }

        window.addEventListener('resize', resizeWindow)

        return () => {
            window.removeEventListener('resize', resizeWindow)
        }

    }, [])

    return isMobile
}