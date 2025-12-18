import * as Yup from "yup";

const LoginValidate = Yup.object({
  identifier: Yup.string()
    .required("Email / Username wajib diisi"),
  password: Yup.string()
    .required("Password wajib diisi"),
});

export default LoginValidate;
