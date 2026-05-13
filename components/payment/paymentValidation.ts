export type ValidationResult =
  | { isValid: true }
  | { isValid: false; title: string; message: string };

export type PaymentInput = {
  cardNumber: string;
  cardholderName: string;
  expireDate: string;
  cvc: string;
};

type FieldValidationResult = true | string;

export function validateCardNumberField(value: string): FieldValidationResult {
  const cleanValue = value.replace(/\s/g, "");

  if (cleanValue === "") {
    return "Card number is required.";
  }

  if (!/^\d+$/.test(cleanValue)) {
    return "Card number must contain numbers only.";
  }

  if (cleanValue.length !== 16) {
    return "Card number must be exactly 16 digits.";
  }

  return true;
}

export function validateCardholderNameField(
  value: string,
): FieldValidationResult {
  const cleanValue = value.trim();

  if (cleanValue === "") {
    return "Cardholder name is required.";
  }

  if (/\d/.test(cleanValue)) {
    return "Cardholder name must not contain numbers.";
  }

  if (cleanValue.length < 7) {
    return "Cardholder name must be at least 7 characters.";
  }

  if (cleanValue.length > 36) {
    return "Cardholder name must not be more than 36 characters.";
  }

  return true;
}

export function validateExpireDateField(value: string): FieldValidationResult {
  const cleanValue = value.trim();

  if (cleanValue === "") {
    return "Expire date is required.";
  }

  if (!/^\d{2}\/\d{2}$/.test(cleanValue)) {
    return "Expire date must be in MM/YY format.";
  }

  const [monthText, yearText] = cleanValue.split("/");
  const month = Number(monthText);
  const year = Number(yearText);

  if (month < 1 || month > 12) {
    return "Month must be between 01 and 12.";
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has expired.";
  }

  return true;
}

export function validateCvcField(value: string): FieldValidationResult {
  const cleanValue = value.trim();

  if (cleanValue === "") {
    return "CVC is required.";
  }

  if (!/^\d{3}$/.test(cleanValue)) {
    return "CVC must be exactly 3 digits.";
  }

  return true;
}

export function validatePaymentDetails({
  cardNumber,
  cardholderName,
  expireDate,
  cvc,
}: PaymentInput): ValidationResult {
  const cleanCardNumber = cardNumber.replace(/\s/g, "");
  const cleanCardholderName = cardholderName.trim();
  const cleanExpireDate = expireDate.trim();
  const cleanCvc = cvc.trim();

  if (
    cleanCardNumber === "" ||
    cleanCardholderName === "" ||
    cleanExpireDate === "" ||
    cleanCvc === ""
  ) {
    return {
      isValid: false,
      title: "Missing Information",
      message: "Please fill in all payment fields.",
    };
  }

  const cardNumberError = validateCardNumberField(cardNumber);

  if (cardNumberError !== true) {
    return {
      isValid: false,
      title: "Invalid Card Number",
      message: cardNumberError,
    };
  }

  const cardholderNameError = validateCardholderNameField(cardholderName);

  if (cardholderNameError !== true) {
    return {
      isValid: false,
      title: "Invalid Cardholder Name",
      message: cardholderNameError,
    };
  }

  const expireDateError = validateExpireDateField(expireDate);

  if (expireDateError !== true) {
    return {
      isValid: false,
      title: "Invalid Expire Date",
      message: expireDateError,
    };
  }

  const cvcError = validateCvcField(cvc);

  if (cvcError !== true) {
    return {
      isValid: false,
      title: "Invalid CVC",
      message: cvcError,
    };
  }

  return { isValid: true };
}

export function cleanPaymentDetails({
  cardNumber,
  cardholderName,
  expireDate,
  cvc,
}: PaymentInput) {
  const cleanCardNumber = cardNumber.replace(/\s/g, "");

  return {
    cardNumber: cleanCardNumber,
    cardholderName: cardholderName.trim(),
    expireDate: expireDate.trim(),
    cvc: cvc.trim(),
    cardLast4: cleanCardNumber.slice(-4),
  };
}

export function formatExpireDate(value: string) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 4);

  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }

  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
}

export function formatCardNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 16);

  return digitsOnly.replace(/(.{4})/g, "$1 ").trim();
}

export function formatCvc(value: string) {
  return value.replace(/\D/g, "").slice(0, 3);
}