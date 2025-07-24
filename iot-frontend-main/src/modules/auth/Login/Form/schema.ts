import * as yup from "yup";

const schema = yup.object({
  emailOrPhone: yup.string().email("Email Tidak Valid").required("Email wajib diisi"),
  password: yup.string().required("Password wajib diisi"),
});

export default schema;
