import * as yup from "yup";

import { ONLY_NUMBER_REGEX } from "@/constants/regex";

const schema = yup.object({
  fullname: yup.string().min(5, "Nama minimal 5 karakter").required("Nama lengkap wajib diisi"),
  email: yup.string().email("Email Tidak Valid").required("Email wajib diisi"),
  password: yup.string().min(8, "Password minimal 8 karakter").required("Password wajib diisi"),
  phone_number: yup
    .string()
    .matches(ONLY_NUMBER_REGEX, "Hanya boleh memasukan angka")
    .min(10, "Minimal 10 karakter")
    .required(),
  confirmPassword: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .oneOf([yup.ref("password"), ""], "Password tidak sesuai")
    .required("Konfirmasi password wajib diisi"),
  villages: yup.array().required().min(1, "Desa wajib diisi"),
});

export default schema;
