import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import React from "react"; 

const ProjectForm = ({ onSubmit }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            tags: '',
            categories: '',
            image: null,
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            tags: Yup.string().required('Tags are required'),
            categories: Yup.string().required('Categories are required'),
            image: Yup.mixed().required('Image is required'),
        }),
        onSubmit: async (values) => {
            try {
                // Create FormData to submit image and other project data
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('description', values.description);
                formData.append('tags', values.tags);
                formData.append('categories', values.categories);
                formData.append('image', values.image);

                // Use fetch API to send project data to the server
                const response = await fetch('/api/projects/', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to create project');
                }

                const result = await response.json();
                console.log('Project created successfully:', result);

                // Call the parent onSubmit function after successful submission
                onSubmit();
            } catch (error) {
                console.error('Error creating project:', error);
            }
        },
    });

    // Handle image file change and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue('image', file);
            setImagePreview(URL.createObjectURL(file)); // Preview image
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <label htmlFor="title">Project Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Project Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                />
                {formik.errors.title && formik.touched.title && (
                    <div>{formik.errors.title}</div>
                )}
            </div>

            <div>
                <label htmlFor="description">Project Description</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Project Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                />
                {formik.errors.description && formik.touched.description && (
                    <div>{formik.errors.description}</div>
                )}
            </div>

            <div>
                <label htmlFor="tags">Tags</label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={formik.values.tags}
                    onChange={formik.handleChange}
                />
                {formik.errors.tags && formik.touched.tags && (
                    <div>{formik.errors.tags}</div>
                )}
            </div>

            <div>
                <label htmlFor="categories">Categories</label>
                <input
                    type="text"
                    id="categories"
                    name="categories"
                    placeholder="Categories (comma separated)"
                    value={formik.values.categories}
                    onChange={formik.handleChange}
                />
                {formik.errors.categories && formik.touched.categories && (
                    <div>{formik.errors.categories}</div>
                )}
            </div>

            <div>
                <label htmlFor="image">Project Image</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {imagePreview && <img src={imagePreview} alt="Image preview" width="100" />}
                {formik.errors.image && formik.touched.image && (
                    <div>{formik.errors.image}</div>
                )}
            </div>

            <button type="submit" disabled={formik.isSubmitting}>
                Submit
            </button>
        </form>
    );
};

export default ProjectForm;
