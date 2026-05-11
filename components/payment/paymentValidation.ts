export type ValidationResult =
  | { isValid: true }
  | { isValid: false; title: string; message: string };

type PaymentInput = {
  cardNumber: string;
  cardholderName: string;
  expireDate: string;
  cvc: string;
};

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

  if (!/^\d+$/.test(cleanCardNumber)) {
    return {
      isValid: false,
      title: "Invalid Card Number",
      message: "Card number must contain numbers only.",
    };
  }

  if (cleanCardNumber.length < 13) {
    return {
      isValid: false,
      title: "Invalid Card Number",
      message: "Card number must be at least 13 digits.",
    };
  }

  if (cleanCardNumber.length > 19) {
    return {
      isValid: false,
      title: "Invalid Card Number",
      message: "Card number must not be more than 19 digits.",
    };
  }

  if (/\d/.test(cleanCardholderName)) {
    return {
      isValid: false,
      title: "Invalid Cardholder Name",
      message: "Cardholder name must not contain numbers.",
    };
  }

  if (cleanCardholderName.length < 7) {
    return {
      isValid: false,
      title: "Invalid Cardholder Name",
      message: "Cardholder name must be at least 7 characters.",
    };
  }

  if (cleanCardholderName.length > 36) {
    return {
      isValid: false,
      title: "Invalid Cardholder Name",
      message: "Cardholder name must not be more than 36 characters.",
    };
  }

  if (!/^\d{2}\/\d{2}$/.test(cleanExpireDate)) {
    return {
      isValid: false,
      title: "Invalid Expire Date",
      message: "Expire date must be in MM/YY format.",
    };
  }

  const [monthText, yearText] = cleanExpireDate.split("/");
  const month = Number(monthText);
  const year = Number(yearText);

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      title: "Invalid Expire Date",
      message: "Month must be between 01 and 12.",
    };
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return {
      isValid: false,
      title: "Invalid Expire Date",
      message: "Card has expired.",
    };
  }

  if (!/^\d{3,4}$/.test(cleanCvc)) {
    return {
      isValid: false,
      title: "Invalid CVC",
      message: "CVC must be 3 or 4 digits.",
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
