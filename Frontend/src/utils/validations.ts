export const isEmpty = (text: any): boolean =>
  text === null ||
  text === undefined ||
  (typeof text === 'string' &&
    (text === '' ||
      text.replace(/<br ?\/?>/gi, '').replace(/<\/?p>/gi, '') === '')) ||
  (Array.isArray(text) && text.length === 0);

export const isValidName = (name: string): boolean => {
  const tester = /[;<>≤≥`~§±!@#$%^&*_=+≠{}|"?÷]/;
  return !isEmpty(name) && !tester.test(name);
};

export const isValidEmail = (
  email: string | null,
  options = { trim: false },
): boolean => {
  if (!email) {
    return false;
  }
  const s = options.trim ? email.trim() : email;

  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(s);
};

export const isValidPassword = (password: string): boolean => {
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  return re.test(password);
};

export const isValidPhone = (phone: string): boolean => {
  const re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return re.test(phone);
};

export const isValidDate = (phone: string): boolean => {
  const re = /^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d$/;
  return re.test(phone);
};

export const emailValidator = (value: string): string | null => {
  if (isEmpty(value)) return 'Email field is required.';
  if (!isValidEmail(value)) return 'Please provide a valid email.';
  return null;
};

export const passwordValidator = (value: string): string | null => {
  if (isEmpty(value)) return 'Password field is required.';
  if (!isValidPassword(value))
    return 'Length should be more than 8 characters. Must contain at least one number, one uppercase, and one lowercase letter.';
  return null;
};

export const newPasswordValidator =
  (currentPassword: string) =>
  (value: string): string | null => {
    if (value === currentPassword)
      return 'New password matches current, please change new password';
    if (value === undefined || value.length === 0) return '';
    if (!isValidPassword(value))
      return 'Length should be more than 8 characters. Must contain at least one number, one uppercase, and one lowercase letter.';
    return null;
  };

export const rePasswordValidator =
  (password: string) =>
  (value: string): string | null => {
    if (password !== value) return "Password doesn't match.";
    return passwordValidator(value);
  };

export const phoneValidator = (value: string): string | null => {
  if (isEmpty(value)) return 'Phone number is required.';
  return isValidPhone(value) ? null : 'Please provide a valid phone number.';
};

export const nameValidator = (value: string): string | null => {
  if (isEmpty(value)) return 'Name field is required.';
  return isValidName(value) ? null : 'Please provide a valid name.';
};

export const dateValidator = (value: string): string | null => {
  if (isEmpty(value)) return 'Date field is required.';
  return isValidDate(value) ? null : 'Please provide a valid date.';
};
