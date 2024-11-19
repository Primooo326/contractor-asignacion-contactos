
import { JWT_SECRET } from '@/config'
import * as jose from 'jose'

export const verifyJWT = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jose.jwtVerify(token, secret)
        return payload
    } catch (error) {
        return false
    }
}

export const formatFecha = (fecha: string | number | Date) => {
    const fechaOptions: any =
    {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        hour12: true,
    }
    const fechaDate = new Date(fecha)
    return fechaDate.toLocaleDateString('es-ES', fechaOptions)
}
export function formatTime(minutes: number): string {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const remainingMinutes = Math.floor(minutes % 60);

    const dayStr = days > 0 ? `${days}d` : '';
    const hourStr = hours > 0 ? `${hours}h` : '';
    const minuteStr = remainingMinutes > 0 ? `${remainingMinutes} min` : '';

    return [dayStr, hourStr, minuteStr].filter(Boolean).join(' ').trim();
}

export const getInitials = (name: string) => {
    const names = name.split(' ').filter(n => n.length > 0);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}


export const getRandomColorBg = () => {
    const colors = [
        'bg-orange-200 text-orange-700',
        'bg-cyan-200 text-cyan-500',
        'bg-lime-200 text-lime-700',
        'bg-yellow-200 text-yellow-700',
        'bg-red-200 text-red-700',
        'bg-violet-200 text-violet-700',
        'bg-green-200 text-green-700',
        'bg-sky-200 text-sky-700',
        'bg-blue-200 text-blue-700',
        'bg-violet-200 text-violet-700',
        'bg-rose-200 text-rose-700',
        'bg-fuchsia-200 text-fuchsia-700',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

