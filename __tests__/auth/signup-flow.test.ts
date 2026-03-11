import {
  buildFinalSignupPayload,
  requiresFirmDetailsStep,
} from '../../src/screens/Auth/signupFlow';

describe('signup flow guards', () => {
  it('requires firm details for farmer', () => {
    expect(requiresFirmDetailsStep('Farmer')).toBe(true);
  });

  it('requires firm details for technician', () => {
    expect(requiresFirmDetailsStep('Technician')).toBe(true);
  });

  it('does not require firm details for customer', () => {
    expect(requiresFirmDetailsStep('Customer')).toBe(false);
  });

  it('treats unknown roles conservatively and requires firm details', () => {
    expect(requiresFirmDetailsStep('Vendor')).toBe(true);
    expect(requiresFirmDetailsStep('')).toBe(true);
  });
});

describe('final signup payload builder', () => {
  it('preserves personal details and merges farmer fields', () => {
    const payload = buildFinalSignupPayload(
      {
        email: 'farmer@example.com',
        address: 'Village 1',
        password: 'secret123',
        confirmPassword: 'secret123',
        phone: '111111111',
        name: 'Farmer One',
        professionType: 'Farmer',
      },
      {
        farmingType: 'Organic',
        farmSize: '12 acres',
        yearsOfExperience: '7',
      },
      {
        phone: 'fallback-phone',
        email: 'fallback@email.com',
        professionType: 'FallbackRole',
        address: 'Fallback Address',
        name: 'Fallback Name',
      },
    );

    expect(payload).toMatchObject({
      email: 'farmer@example.com',
      address: 'Village 1',
      password: 'secret123',
      confirmPassword: 'secret123',
      phone: '111111111',
      name: 'Farmer One',
      professionType: 'Farmer',
      farmingType: 'Organic',
      farmSize: '12 acres',
      yearsOfExperience: '7',
    });
  });

  it('falls back to store values when personal details are missing', () => {
    const payload = buildFinalSignupPayload(
      undefined,
      {
        technicianType: 'Irrigation',
        yearsOfExperience: '3',
      },
      {
        phone: '222222222',
        email: 'tech@example.com',
        professionType: 'Technician',
        address: 'Main Street',
        name: 'Tech User',
      },
    );

    expect(payload).toMatchObject({
      technicianType: 'Irrigation',
      yearsOfExperience: '3',
      phone: '222222222',
      email: 'tech@example.com',
      professionType: 'Technician',
      address: 'Main Street',
      name: 'Tech User',
    });
  });
});
