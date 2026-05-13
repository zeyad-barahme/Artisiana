type CheckoutDetailsInput = {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
};

type FieldValidationResult = true | string;

export function validateFullNameField(value: string): FieldValidationResult {
  const cleanValue = value.trim();

  if (cleanValue === "") {
    return "Full name is required.";
  }

  if (/\d/.test(cleanValue)) {
    return "Full name must not contain numbers.";
  }

  if (cleanValue.length < 7) {
    return "Full name must be at least 7 characters.";
  }

  if (cleanValue.length > 36) {
    return "Full name must not be more than 36 characters.";
  }

  return true;
}

export function validatePhoneNumberField(value: string): FieldValidationResult {
  const cleanValue = value.trim();

  if (cleanValue === "") {
    return "Phone number is required.";
  }

  if (!/^\d+$/.test(cleanValue)) {
    return "Phone number must contain numbers only.";
  }

  if (cleanValue.length < 6) {
    return "Phone number must be at least 6 digits.";
  }

  if (cleanValue.length > 13) {
    return "Phone number must not be more than 13 digits.";
  }

  return true;
}

export function validateAddressField(value: string): FieldValidationResult {
  const cleanValue = value.trim();

  if (cleanValue === "") {
    return "Address is required.";
  }

  if (cleanValue.length < 3) {
    return "Address must be at least 3 characters.";
  }

  return true;
}

export function validateCityField(value: string): FieldValidationResult {
  const cleanValue = value.trim();

  if (cleanValue === "") {
    return "City is required.";
  }

  if (/\d/.test(cleanValue)) {
    return "City must not contain numbers.";
  }

  if (cleanValue.length < 3) {
    return "City must be at least 3 characters.";
  }

  return true;
}

export function cleanCheckoutDetails({
  fullName,
  phoneNumber,
  address,
  city,
}: CheckoutDetailsInput) {
  return {
    fullName: fullName.trim(),
    phoneNumber: phoneNumber.trim(),
    address: address.trim(),
    city: city.trim(),
  };
}
