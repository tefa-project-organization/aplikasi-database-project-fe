import React, { useState } from "react"
import { Formik, Form, Field as FormikField } from "formik"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Field,
    FieldContent,
    FieldTitle,
    FieldError,
} from "@/components/ui/field"

import LoginTheme from "./LoginTheme"
import LoginValidate from "./LoginValidate"
import loginAsset from "@/assets/img/login-asset.svg"

import { apiPost } from "@/lib/api"
import { CREATE_LOGIN } from "@/constants/api/auth"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">

            {/* LEFT — IMAGE */}
            <div className="hidden lg:flex items-center justify-center">
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

                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Login
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Silakan masuk untuk melanjutkan
                        </p>
                    </div>

                    <Formik
                        initialValues={{ identifier: "", password: "" }}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={async (values, { setSubmitting }) => {
  try {
    await login({
      identifier: values.identifier,
      password: values.password,
    });

    navigate("/dashboard");
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert(err.message || "Login gagal");
  } finally {
    setSubmitting(false);
  }
}}

                    >

                        {({ errors, touched }) => (
                            <Form className="space-y-6" autoComplete="off">

                                {/* IDENTIFIER */}
                                <FormikField name="identifier">
                                    {({ field }) => (
                                        <Field data-invalid={errors.identifier && touched.identifier}>
                                            <FieldTitle>Email / Username</FieldTitle>
                                            <FieldContent>
                                                <Input
                                                    {...field}
                                                    placeholder="Masukkan email atau username"
                                                    autoComplete="off"
                                                />
                                            </FieldContent>
                                            {errors.identifier && touched.identifier && (
                                                <FieldError>{errors.identifier}</FieldError>
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
    )
}