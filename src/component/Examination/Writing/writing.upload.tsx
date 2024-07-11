import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import WritingTask1 from './task1.writing';
import WritingTask2 from './task2.writing';
import { FormDataType } from './writing';
import { submitDataTests, submitDataWrting, updateRelationtoWriting, uploadAndUpdate } from '@/utils/api';
import { duration } from '@mui/material';

export interface dataWritingProps {
    formData: FormDataType,
    setFormData: (formData: FormDataType) => void,
    openModalUploadTab: boolean,
    setOpenModalUploadTab: (openModalUploadTab: boolean) => void,
}

interface formDataImg {
    img1: File;
}

const WritingTabUpload = (props: any) => {


    const [currentTaskType, setCurrentTaskType] = useState<string | null>(null);
    const [uploadedImage1, setUploadedImage1] = useState<string | null>(null);
    const [uploadedImage2, setUploadedImage2] = useState<string | null>(null);

    const { formData, setFormData, openModalUploadTab, setOpenModalUploadTab } = props;

    const handleAddTask = (type: string) => {
        setCurrentTaskType(type);
    };

    const handleSubmit = async () => {
        await submitDataWrting(formData)
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_LINK_API_URL}/wrtings?sort=id:desc`);
        const data = await res.json();
        uploadAndUpdate(data.data[0].id, formData.img1, formData.img2)


        const dataSubmitTests = await submitDataTests(formData);
        if (dataSubmitTests != 'false') {
            const responseTest = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_LINK_API_URL}/tests?sort=id:desc`);
            const dataTest = await responseTest.json();
            const checkUpdate = await updateRelationtoWriting(dataTest.data[0].id, data.data[0].id)
            if (checkUpdate) {
                setFormData({
                    name: "",
                    task1: "",
                    img1: null,
                    img2: null,
                    task2: '',
                    duration: 0,
                    type: "Wrting",
                    start_date: '',
                    end_date: '',
                })
            }
        }
        // const responseTest = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_LINK_API_URL}/tests?sort=id:desc`);
        // const dataTest = await responseTest.json();
        // const checkUpdate = await updateRelationtoWriting(dataTest.data[0].id, data.data[0].id)

        // //get last data
        // // const latestUpdatedData = data.data.reduce((latest: any, current: any) => {
        // //     return new Date(latest.attributes.updatedAt) > new Date(current.attributes.updatedAt) ? latest : current;
        // // });

    };

    const handleClose = () => {
        setOpenModalUploadTab(false);
        setCurrentTaskType(null);
    };

    const handleDurationChange = (event: any) => {
        const value = event.target.value as number;
        setFormData({ ...formData, duration: value });
    };


    const handleTimeChange = (event: any) => {
        console.log(event.target.value);


        setFormData({
            ...formData,
            start_date: event.target.value
        });
    };
    const handleTimeEndChange = (event: any) => {
        console.log(event.target.value);
        setFormData({
            ...formData,
            end_date: event.target.value
        });
    };

    const handleChange = (event: any) => {
        setFormData({
            ...formData,
            name: event.target.value
        });
    }
    return (
        <Modal
            open={openModalUploadTab}
            onClose={handleClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    width: '80vw',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button variant="outlined" onClick={() => handleAddTask('task1')} disabled={currentTaskType === 'task1'}>
                        Add Task 1
                    </Button>
                    <Button variant="outlined" onClick={() => handleAddTask('task2')} disabled={currentTaskType === 'task2'}>
                        Add Task 2
                    </Button>
                </Box>

                {currentTaskType && (
                    <Box sx={{ mt: 2 }}>
                        {currentTaskType === 'task1' && (
                            <WritingTask1
                                formData={formData}
                                setFormData={setFormData}
                                uploadedImage1={uploadedImage1}
                                setUploadedImage1={setUploadedImage1}
                            />
                        )}
                        {currentTaskType === 'task2' && (
                            <WritingTask2
                                formData={formData}
                                setFormData={setFormData}
                                uploadedImage2={uploadedImage2}
                                setUploadedImage2={setUploadedImage2}
                            />
                        )}

                    </Box>
                )}

                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2, flexDirection: "column" }}>
                    <TextField
                        fullWidth
                        label="Test Duration"
                        name="testDuration"
                        value={formData.Duration}
                        onChange={handleDurationChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Strat"
                        type="datetime-local"
                        name="start"
                        value={formData.start_date}
                        onChange={handleTimeChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 minutes
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="End"
                        type="datetime-local"
                        name="end"
                        value={formData.end_date}
                        onChange={handleTimeEndChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 minutes
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default WritingTabUpload;


