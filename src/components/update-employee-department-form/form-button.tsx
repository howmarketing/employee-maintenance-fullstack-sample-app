'use client';

import { useFormStatus } from "react-dom";

export function FormButton() {
    const { pending } = useFormStatus();
    return (
        <button className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-gray-300" disabled={pending}>
            {pending ? 'Saving...' : 'Save'}
        </button>
    )
}
