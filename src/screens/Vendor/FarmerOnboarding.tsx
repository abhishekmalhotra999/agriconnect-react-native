import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';
import {normalize, topInsets} from '../../utils/util';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import {
  FarmerOnboarding,
  getUserPreferences,
  saveFarmerOnboarding,
} from '../../api/preferences.api';
import {userContext} from '../../contexts/UserContext';
import ErrorText from '../../components/UI/ErrorText';

type FarmerOnboardingProps = {
  onCompleted: () => void;
};

const DEFAULT_FORM: FarmerOnboarding = {
  completed: false,
  storeName: '',
  storeTagline: '',
  businessType: 'General Produce',
  serviceArea: '',
  contactPhone: '',
  contactEmail: '',
};

const FarmerOnboardingScreen: React.FC<FarmerOnboardingProps> = ({
  onCompleted,
}) => {
  const {user} = userContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FarmerOnboarding>(DEFAULT_FORM);

  useEffect(() => {
    let cancelled = false;

    getUserPreferences()
      .then(result => {
        if (cancelled) {
          return;
        }

        const existing = result?.farmerOnboarding || {};

        if (existing.completed) {
          onCompleted();
          return;
        }

        setForm({
          ...DEFAULT_FORM,
          ...existing,
          contactPhone:
            existing.contactPhone || user?.phone || DEFAULT_FORM.contactPhone,
          contactEmail:
            existing.contactEmail || user?.email || DEFAULT_FORM.contactEmail,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setForm(prev => ({
            ...prev,
            contactPhone: user?.phone || prev.contactPhone,
            contactEmail: user?.email || prev.contactEmail,
          }));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [onCompleted, user?.email, user?.phone]);

  const update = (key: keyof FarmerOnboarding, value: string) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  const submit = async () => {
    if (!form.storeName?.trim() || !form.serviceArea?.trim() || !form.contactPhone?.trim()) {
      setError('Store name, service area, and contact phone are required.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload: FarmerOnboarding = {
        ...form,
        completed: true,
        completedAt: Date.now(),
      };

      await saveFarmerOnboarding(payload);
      onCompleted();
    } catch (e) {
      setError('Failed to save store setup. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={[styles.content, {paddingTop: topInsets(20)}]}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Farmer Store Setup</Text>
        <Text style={styles.subtitle}>
          Complete this one-time setup to unlock seller features.
        </Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={styles.loader} />
        ) : (
          <>
            <Input
              placeholder="Store Name"
              value={form.storeName}
              onChangeText={value => update('storeName', value)}
            />
            <Input
              placeholder="Store Tagline"
              value={form.storeTagline}
              onChangeText={value => update('storeTagline', value)}
            />
            <Input
              placeholder="Business Type"
              value={form.businessType}
              onChangeText={value => update('businessType', value)}
            />
            <Input
              placeholder="Service Area"
              value={form.serviceArea}
              onChangeText={value => update('serviceArea', value)}
            />
            <Input
              placeholder="Contact Phone"
              value={form.contactPhone}
              keyboardType="phone-pad"
              onChangeText={value => update('contactPhone', value)}
            />
            <Input
              placeholder="Contact Email"
              value={form.contactEmail}
              keyboardType="email-address"
              onChangeText={value => update('contactEmail', value)}
            />

            {error && <ErrorText text={error} />}

            <Button
              label={saving ? 'Saving...' : 'Complete Store Setup'}
              onPress={submit}
              disabled={saving}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(40),
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.XLARGE,
    color: COLORS.black,
    marginBottom: normalize(8),
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    marginBottom: normalize(20),
  },
  loader: {
    marginTop: normalize(20),
  },
  button: {
    marginTop: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 60,
  },
  buttonLabel: {
    color: COLORS.primary,
  },
});

export default FarmerOnboardingScreen;
