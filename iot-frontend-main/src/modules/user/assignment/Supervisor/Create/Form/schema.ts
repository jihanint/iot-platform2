import * as yup from "yup";

import type { TUserRole } from "@/services/user/type";

const schema = yup.object({
  user_id: yup.number().required(),
  user_name: yup.string().min(5, "Nama minimal 5 karakter").required("Nama lengkap wajib diisi"),
  phone_number: yup
    .string()
    .matches(/^[0-9]+$/, "Nomor telepon harus berupa angka")
    .min(8, "Nomor telepon minimal 8 angka")
    .required("Nomor telepon wajib diisi"),
  role: yup.string().required().oneOf<TUserRole>(["MANAGER", "SUPERVISOR"]),
  villages: yup.array().required().min(1, "Desa wajib diisi"),
});

export default schema;
