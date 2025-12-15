import React, { useState } from "react";
import { Formik, Form, Field as FormikField } from "formik";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Field,
    FieldContent,
    FieldTitle,
    FieldError,
} from "@/components/ui/field";

import LoginTheme from "./LoginTheme";
import LoginValidate from "./LoginValidate";
import loginAsset from "@/assets/img/login-asset.svg";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">

            {/* LEFT — IMAGE */}
            <div className="hidden lg:flex items-center justify-center">
                {/* THEME TOGGLE */}
                <div className="absolute bottom-6 left-6">
                    <LoginTheme />
                </div>
                <div className="max-w-sm text-center px-6">
                    <img
                        src={loginAsset}
                        alt="Login Illustration"
                        className="w-full h-auto mb-6 opacity-90"
                    />

                    <h2 className="text-3xl font-semibold mb-3 text-foreground">
                        Welcome Back
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Sistem internal untuk membantu pengelolaan data dan operasional
                        secara efisien.
                    </p>
                </div>
            </div>

            {/* RIGHT — FORM */}
            <div className="relative flex items-center justify-center px-6">
                <div className="w-full max-w-md space-y-8">

                    {/* HEADER */}
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Login
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Silakan masuk untuk melanjutkan
                        </p>
                    </div>

                    {/* FORM */}
                    <Formik
                        initialValues={{ username: "", password: "" }}
                        validationSchema={LoginValidate}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={(values) => {
                            console.log("LOGIN PAYLOAD:", values);
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form className="space-y-6" autoComplete="off">

                                {/* USERNAME */}
                                <FormikField name="username">
                                    {({ field }) => (
                                        <Field data-invalid={errors.username && touched.username}>
                                            <FieldTitle>Username</FieldTitle>
                                            <FieldContent>
                                                <Input
                                                    {...field}
                                                    placeholder="Masukkan username"
                                                    autoComplete="off"
                                                />
                                            </FieldContent>
                                            {errors.username && touched.username && (
                                                <FieldError>{errors.username}</FieldError>
                                            )}
                                        </Field>
                                    )}
                                </FormikField>

                                {/* PASSWORD */}
                                <FormikField name="password">
                                    {({ field }) => (
                                        <Field data-invalid={errors.password && touched.password}>
                                            <FieldTitle>Password</FieldTitle>

                                            <FieldContent>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Masukkan password"
                                                        autoComplete="new-password"
                                                        className="pr-10"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="
                              absolute right-2 top-1/2 -translate-y-1/2
                              text-muted-foreground
                              hover:text-foreground
                              transition
                            "
                                                        tabIndex={-1}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FieldContent>

                                            {errors.password && touched.password && (
                                                <FieldError>{errors.password}</FieldError>
                                            )}
                                        </Field>
                                    )}
                                </FormikField>

                                {/* SUBMIT */}
                                <Button
                                    type="submit"
                                    className="w-full h-10 bg-neutral-900 text-white hover:bg-neutral-800 transition"
                                >
                                    Masuk
                                </Button>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

        </div>
    );
}
