export type ValidationResult =
  | { isValid: true }
  | { isValid: false; title: string; message: string };

type CheckoutDetailsInput = {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
};

export function validateCheckoutDetails({
  fullName,
  phoneNumber,
  address,
  city,
}: CheckoutDetailsInput): ValidationResult {
  const cleanFullName = fullName.trim();
  const cleanPhoneNumber = phoneNumber.trim();
  const cleanAddress = address.trim();
  const cleanCity = city.trim();

  if (
    cleanFullName === "" ||
    cleanPhoneNumber === "" ||
    cleanAddress === "" ||
    cleanCity === ""
  ) {
    return {
      isValid: false,
      title: "Missing Information",
      message: "Please fill in all fields.",
    };
  }

  if (/\d/.test(cleanFullName)) {
    return {
      isValid: false,
      title: "Invalid Full Name",
      message: "Full name must not contain numbers.",
    };
  }

  if (cleanFullName.length < 7) {
    return {
      isValid: false,
      title: "Invalid Full Name",
      message: "Full name must be at least 7 characters.",
    };
  }

  if (cleanFullName.length > 36) {
    return {
      isValid: false,
      title: "Invalid Full Name",
      message: "Full name must not be more than 36 characters.",
    };
  }

  if (!/^\d+$/.test(cleanPhoneNumber)) {
    return {
      isValid: false,
      title: "Invalid Phone Number",
      message: "Phone number must contain numbers only.",
    };
  }

  if (cleanPhoneNumber.length < 6) {
    return {
      isValid: false,
      title: "Invalid Phone Number",
      message: "Phone number must be at least 6 digits.",
    };
  }

  if (cleanPhoneNumber.length > 13) {
    return {
      isValid: false,
      title: "Invalid Phone Number",
      message: "Phone number must not be more than 13 digits.",
    };
  }

  if (/\d/.test(cleanAddress)) {
    return {
      isValid: false,
      title: "Invalid Address",
      message: "Address must not contain numbers.",
    };
  }

  if (cleanAddress.length < 3) {
    return {
      isValid: false,
      title: "Invalid Address",
      message: "Address must be at least 3 characters.",
    };
  }

  if (/\d/.test(cleanCity)) {
    return {
      isValid: false,
      title: "Invalid City",
      message: "City must not contain numbers.",
    };
  }

  if (cleanCity.length < 3) {
    return {
      isValid: false,
      title: "Invalid City",
      message: "City must be at least 3 characters.",
    };
  }

  return { isValid: true };
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
