import React from 'react'
import { DynamicIcon } from './DynamicIcon'

export default function Navbar() {
    return (
        <div className="navbar border-b-2 border-base-300 px-4">
            <div className="navbar-start">

                <img src="/logoBlack.svg" alt="contractor" style={{ width: '280px' }} />

            </div>

            <div className="navbar-end">
                <a className="btn btn-error">Cerrar sesión <DynamicIcon icon="mi:log-out" /></a>
            </div>
        </div>
    )
}
