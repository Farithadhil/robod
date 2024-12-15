"use client"
import ProjectForm from '@/components/ProjectForm';
import { useRouter } from "next/navigation";
import React from "react"; 

const CreateProjectPage = () => {
    const router = useRouter();

    const handleSubmit = () => {
        // Redirect to "My Projects" or dashboard after successful form submission
        router.push('/projects');
    };

    return (
        <div>
            <h1>Create a New Project</h1>
            <ProjectForm onSubmit={handleSubmit} />
        </div>
    );
};

export default CreateProjectPage;
