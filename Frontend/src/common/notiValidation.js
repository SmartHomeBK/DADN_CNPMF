export const notiValidation = {
  empty: "Vui lòng không bỏ trống",
  email: "Vui lòng nhập đúng định dạng email",
  min: (min) => {
    return `Vui lòng nhập tối thiểu ${min} ký tự`;
  },
  max: (max) => {
    return `Vui lòng nhập tối đa ${max} ký tự`;
  },
};
