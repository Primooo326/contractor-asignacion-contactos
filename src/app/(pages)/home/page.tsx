import React from 'react'
import ContactsSection from './components/ContactsSection';
import AsociadoSection from './components/AsociadoSection';
export default function page() {
    return (
        <div className=' w-full flex'>
            <ContactsSection />
            <AsociadoSection />
        </div>
    )
}
