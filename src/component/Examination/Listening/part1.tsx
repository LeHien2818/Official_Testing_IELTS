'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { ListeningTest } from '@/utils/postListening';
import DeleteIcon from '@mui/icons-material/Delete';

const lt = new ListeningTest();

const Part1 = (props: any) => {
    const { formData, setFormData, uploadedImage1, setUploadedImage1, uploadedAudio1, setUploadedAudio1 } = props;
    const [questions1, setQuestions] = useState<{ type: string, content: string, answer: string, choices?: { [key: string]: string } }[]>(formData?.question1|| []);
    const [audio1, setAudio1] = useState();
    const [image1, setImage1] = useState();
    console.log(formData)

    useEffect(() => {
        if (formData.img1 && formData.img1.data && formData.img1.data.length > 0) {
            const imageUrl = formData.img1.data[0].attributes.formats ?
                formData.img1.data[0].attributes.formats.thumbnail.url :
                formData.img1.data[0].attributes.url;
            setUploadedImage1(`${process.env.NEXT_PUBLIC_STRAPI_LINK_URL}${imageUrl} `);
        }
    }, [formData, setUploadedImage1]);

    useEffect(() => {
        if (formData.audio1 && formData.audio1.data && formData.audio1.data.length > 0) {
            const audioUrl = formData.audio1.data[0].attributes.url;
            setUploadedAudio1(`${process.env.NEXT_PUBLIC_STRAPI_LINK_URL}${audioUrl} `);
        }
    }, [formData, setUploadedAudio1]);

    const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage1(reader.result as string);
            };
            reader.readAsDataURL(file);
            setFormData({ ...formData, img1: file });
        }
    };

    const handleAudioChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedAudio1(reader.result as string);
            };
            reader.readAsDataURL(file);
            setFormData({ ...formData, audio1: file });
        }
    };

    const addQuestion = () => {
        setQuestions([...questions1, { type: 'filling', content: '', answer: '', choices: {} }]);
        setFormData({ ...formData, question1: questions1 });
    };

    const handleQuestionChange = (index: number, field: string, value: string) => {
        const newQuestions = questions1.map((question, qIndex) =>
            qIndex === index ? { ...question, [field]: value } : question
        );
        setQuestions(newQuestions);
        setFormData({ ...formData, question1: newQuestions });
    };

    const handleChoiceChange = (index: number, choice: string, value: string) => {
        const newQuestions = questions1.map((question, qIndex) => 
            qIndex === index ? { ...question, choices: { ...question.choices, [choice]: value } } : question
        );
        setQuestions(newQuestions);
        setFormData({ ...formData, question1: newQuestions });
    };

    const renderChoices = (questionIndex: number) => (
        <Box>
            {['A', 'B', 'C', 'D'].map(choice => (
                <TextField
                    key={choice}
                    fullWidth
                    label={`Choice ${choice}`}
                    value={questions1[questionIndex].choices?.[choice] || ''}
                    onChange={(e) => handleChoiceChange(questionIndex, choice, e.target.value)}
                    sx={{ mb: 2 }}
                />
            ))}
        </Box>
    );

    const removeQuestion = (index: number) => {
        const newQuestions = questions1.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
        setFormData({ ...formData, questions1: newQuestions });
    };
    

    const handleAddAudio = (audio: any ) => {
         lt.addAudio(audio)
    }
    const handleAddImage = (image: any) => {
         lt.addImage(image)
    }
    const handleSubmit = async () => {
        console.log(lt)
        for (const question of questions1) {
            if (question.type === 'filling') {
                lt.addFilling(question.content, question.answer);
            } else if (question.type === 'multiplechoice') {
                lt.addMultiplechoice(question.content, question.answer, question.choices);
            }
        }
        await lt.submitForm();
    };

    return (
        <>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: 'calc(50% - 16px)' }}>
                    <label htmlFor="upload-audio1">
                        <input
                            style={{ display: 'none' }}
                            id="upload-audio1"
                            name="upload-audio1"
                            type="file"
                            accept="audio/*"
                            onChange={(e) => {
                              if (e.target.files !== null) handleAddAudio(e.target.files[0])
                                handleAudioChange1(e) 
                            }}
                        />
                        <IconButton color="primary" aria-label="upload audio" component="span">
                            <AudiotrackIcon />
                        </IconButton>
                        <span style={{ marginLeft: '8px', color: 'rgba(0, 0, 0, 0.54)' }}>
                            Upload audio
                        </span>
                    </label>
                    <br/>
                    <label htmlFor="upload-photo1">
                        <input
                            style={{ display: 'none' }}
                            id="upload-photo1"
                            name="upload-photo1"
                            type="file"
                            onChange={(e) => {
                              if (e.target.files !== null) handleAddImage(e.target.files[0])
                                handleFileChange1(e)
                            }}
                        />
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <PhotoCameraIcon />
                        </IconButton>
                    </label>
                    <span style={{ marginLeft: '8px', color: 'rgba(0, 0, 0, 0.54)' }}>
                        Upload image
                    </span>
                </Box>
                <Box sx={{
                    width: '60%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                    {uploadedImage1 && (
                        <img
                            style={{ maxWidth: '90%', maxHeight: '65%', objectFit: 'contain' }}
                            src={uploadedImage1}
                            alt="Uploaded"
                        />
                    )}
                    {uploadedAudio1 && (
                        <audio controls>
                            <source src={uploadedAudio1} type="audio/ogg" />
                        </audio>
                    )}
                </Box>
            </Box>
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    flexDirection: 'column',
                }}
            >
                {
                questions1.map((question, index) =>{
                 return  (
                    <Box key={index} sx={{ mb: 2, width: '100%', position: 'relative' }}>
                      <TextField
                            fullWidth
                            label={`Question ${index + 1}`}
                            name={`question-${index}`}
                            value={question.content}
                            onChange={(e) => handleQuestionChange(index, 'content', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <IconButton
                            onClick={() => removeQuestion(index)}
                            sx={{ position: 'absolute', right: 0, top: 0 }}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <Select
                            value={question.type}
                            onChange={(e) => handleQuestionChange(index, 'type', e.target.value as string)}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="filling">Filling</MenuItem>
                            <MenuItem value="multiplechoice">Multiple Choice</MenuItem>
                        </Select>
                        {question.type === 'multiplechoice' && renderChoices(index)}
                        <TextField
                            fullWidth
                            label="Answer"
                            name={`answer-${index}`}
                            value={question.answer}
                            onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Box>
                )
                } )}
                <Button variant="contained" onClick={addQuestion} sx={{ mb: 2 }}>
                    Add Question
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </>
    );
}
export default Part1;
