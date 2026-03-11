type PersonalDetails = {
  email?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  name?: string;
  professionType?: string;
};

type RoleDetails = {
  farmingType?: string;
  farmSize?: string;
  yearsOfExperience?: string;
  technicianType?: string;
};

type FallbackDetails = {
  phone?: string;
  email?: string;
  professionType?: string;
  address?: string;
  name?: string;
};

const normalizeRole = (role?: string): string =>
  String(role || '').trim().toLowerCase();

export const requiresFirmDetailsStep = (accountType?: string): boolean => {
  return normalizeRole(accountType) !== 'customer';
};

export const buildFinalSignupPayload = (
  personalDetails: PersonalDetails | undefined,
  roleDetails: RoleDetails,
  fallback: FallbackDetails,
) => {
  const merged = {
    ...(personalDetails || {}),
    ...roleDetails,
  };

  return {
    ...merged,
    phone: merged.phone || fallback.phone,
    email: merged.email || fallback.email,
    professionType: merged.professionType || fallback.professionType,
    address: merged.address || fallback.address,
    name: merged.name || fallback.name,
  };
};
