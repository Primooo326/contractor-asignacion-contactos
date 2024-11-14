import React from 'react'
import { DynamicIcon } from './DynamicIcon'

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow -b-sm">
            <div className="navbar-start">

                <img src="/logo.jpg" alt="contractor" style={{ width: '280px' }} />

            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Item 1</a></li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a>Item 3</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <a className="btn btn-error">Cerrar sesión <DynamicIcon icon="mi:log-out" /></a>
            </div>
        </div>
    )
}
