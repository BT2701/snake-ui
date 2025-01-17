import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, Input, Divider, Box, Heading, Flex, VStack, useToast, Select, } from '@chakra-ui/react';
import { RiEdit2Fill } from 'react-icons/ri';
import { useState, useEffect } from "react";
import axios from 'axios';
import { current } from '@reduxjs/toolkit';

export const EditProfile = ({ m, w, title, userData, setUser }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: '',
        birthday: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        relationship: '',
        education: '',
        social: '',
        description: ''
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                birthday: userData.birthday ? userData.birthday.split('T')[0] : '',
                email: userData.email || '',
                phone: userData.phone || '',
                gender: userData.gender || '',
                address: userData.address || '',
                relationship: userData.relationship || '',
                education: userData.education || '',
                social: userData.social || '',
                description: userData.description || ''
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSave = async () => {
        // Kiểm tra các trường bắt buộc trong phần Personal Information
        if (!formData.name || !formData.birthday || !formData.email || !formData.phone || !formData.gender || !formData.address) {
            toast({
                title: "Missing information",
                description: "All fields in 'Personal Information' are required.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        if (formData.email) {
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailPattern.test(formData.email)) {
                toast({
                    title: "Invalid email",
                    description: "Please enter a valid email address.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
                return;
            }
            const existUser = await axios.get(`${process.env.REACT_APP_API_URL}/user/api/user?email=${formData.email}`);
            if (existUser?.data && existUser?.data.data.id !== userData.id) {
                toast({
                    title: "Email already exists",
                    description: "This email address is already in use. Please enter a different email address.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
                return;
            }
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/api/edit`, {
                email: formData.email,
                user: formData,
            });
            console.log(response?.data);
            setUser(response?.data);

            toast({
                title: "Profile updated.",
                description: "Your profile has been successfully updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Error updating profile.",
                description: "There was an error updating your profile. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        }

        onClose();
    };


    return (
        <>
            <Button leftIcon={<RiEdit2Fill />} m={m} w={w} onClick={onOpen}>{title}</Button>

            <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight={700} textAlign={'center'}>Edit Profile</ModalHeader>
                    <Divider />
                    <ModalCloseButton />
                    <ModalBody>
                        <Box m={'20px'}>
                            <Heading fontSize={20}>Personal Information</Heading>
                            <VStack mt={3} spacing={3}>
                                <Input name='name' value={formData.name} onChange={handleChange} placeholder='Name' />
                                <Input name='birth' value={formData.birthday} onChange={handleChange} placeholder='Birthdate' type="date" />
                                <Input name='email' value={formData.email} onChange={handleChange} placeholder='Email' type="email" />
                                <Input name='phone' value={formData.phone} onChange={handleChange} placeholder='Phone' type="tel" />
                                <Input name='address' value={formData.address} onChange={handleChange} placeholder='Address' />

                                <Select name='gender' value={formData.gender} onChange={handleChange} placeholder='Gender Status'>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="LGBT">LGBT</option>
                                </Select>
                            </VStack>
                        </Box>

                        <Divider />

                        <Box m={'20px'}>
                            <Heading fontSize={20}>Customise your Intro</Heading>
                            <VStack mt={3} spacing={3}>
                                <Input name='education' value={formData.education} onChange={handleChange} placeholder='Education' />

                                <Select name='relationship' value={formData.relationship} onChange={handleChange} placeholder='Relationship Status'>
                                    <option value="Single">Single</option>
                                    <option value="In a relationship">In a relationship</option>
                                    <option value="Married">Married</option>
                                </Select>

                                <Input name='social' value={formData.social} onChange={handleChange} placeholder='Social Link' />
                                <Input name='description' value={formData.description} onChange={handleChange} placeholder='Description' />
                            </VStack>
                        </Box>

                        <Divider />

                        {/* <Box m={'20px'}>
                            <Heading fontSize={20}>Change Password</Heading>
                            <VStack mt={3} spacing={3}>
                                <Input name='password' value={formData.password} onChange={handleChange} placeholder='New Password' type="password" />
                                <Input name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder='Confirm New Password' type="password" />
                            </VStack>
                        </Box> */}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSave}>
                            Save Changes
                        </Button>
                        <Button onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
