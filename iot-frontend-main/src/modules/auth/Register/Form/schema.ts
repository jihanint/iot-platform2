import * as yup from "yup";

const schema = yup.object({
  emailOrPhone: yup.string().email("Email Tidak Valid").required("Email wajib diisi"),
  fullname: yup.string().min(5, "Nama minimal 5 karakter").required("Nama wajib diisi"),
  password: yup.string().min(8, "Password minimal 8 karakter").required("Password wajib diisi"),
  confirmPassword: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .oneOf([yup.ref("password"), ""], "Password tidak sesuai")
    .required("Konfirmasi password wajib diisi"),
});

export default schema;
