import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Template {
    id: string;
    message: string;
}

const SidebarContent: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);

    useEffect(() => {
        axios.get('/api/templates')
            .then(response => setTemplates(response.data))
            .catch(error => console.error(error));
    }, []);

    const copyToClipboard = (message: string) => {
        navigator.clipboard.writeText(message);
    };

    const pasteIntoChat = (message: string) => {
        const chatInput = document.querySelector('[contenteditable="true"]');
        if (chatInput) {
            chatInput.textContent = message;
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Templates</h2>
            <ul>
                {templates.map(template => (
                    <li key={template.id} className="mb-2">
                        <p>{template.message}</p>
                        <button onClick={() => copyToClipboard(template.message)}>Copy</button>
                        <button onClick={() => pasteIntoChat(template.message)}>Paste</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SidebarContent;
