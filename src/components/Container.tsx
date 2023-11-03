import React from 'react'
import ParentProps from '../interfaces/ParentProps'

export default function Container({children}: ParentProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 text-white">
            {children}
        </div>
    )
}