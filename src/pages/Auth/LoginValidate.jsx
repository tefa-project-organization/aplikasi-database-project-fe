import * as Yup from "yup";

const LoginValidate = Yup.object({
  username: Yup.string()
    .required("Username wajib diisi"),
  password: Yup.string()
    .required("Password wajib diisi"),
});

export default LoginValidate;
