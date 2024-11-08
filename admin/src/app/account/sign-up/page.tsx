"use client"
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import classes from './page.module.css';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useAppDispatch } from '@/redux/store';
import { signIn, signUp } from '@/redux/slices/accountSlice';
import ProtectedRoute from '@/components/Account/ProtectedRoute';
import Link from 'next/link';

interface FormData {
    email: string;
    password: string;
    confirm_password: string;
}


export default function page() {

    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
    } = useForm<FormData>();

    const dispatch = useAppDispatch()

    const onSubmit: SubmitHandler<FormData> = (data) => {
        dispatch(signUp(data))
    };


    return (
        <>
        <ProtectedRoute permissions={["IS_ANONYMOUS" ]} />

        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Create A New Account!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Already have an account?{' '}
                <Anchor href={"/account/sign-in/"} size="sm" component={Link}>
                    Sign In
                </Anchor>
            </Text>

            <Paper component='form'  onSubmit={handleSubmit(onSubmit)}  withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Email" placeholder="you@mantine.dev" required  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                })} />
                <PasswordInput label="Password" placeholder="Your password" required mt="md"    {...register("password", { required: "Password is required" })} />
                <PasswordInput label="Confirm Password" placeholder="Your password" required mt="md"    {...register("confirm_password", { required: "Password is required" })} />
                {/* <Group justify="space-between" mt="lg">
                    <Checkbox label="Remember me" />
                    <Anchor component="button" size="sm">
                        Forgot password?
                    </Anchor>
                </Group> */}
                <Button type='submit' fullWidth mt="xl">
                    Sign in
                </Button>
            </Paper>
        </Container>
        </>

    );
}