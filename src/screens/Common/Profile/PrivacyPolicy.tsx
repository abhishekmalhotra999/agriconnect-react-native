import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useEffect} from 'react';
import Header from '../../../containers/header';
import {fetchPrivacyPolicy} from '../../../api/app.api';
import {appActions} from '../../../store/slices/app.slice';
import {useAppDispatch, useAppSelector} from '../../../store/storage';

const tagsStyles = {
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  div: {
    marginBottom: '10px',
  },
};

const privacyPolicy = `<div><strong>Effective Date:</strong> 01/01/2025</div><div>Welcome to <strong>AgriConnect</strong>! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our mobile and web application.</div><div><strong>1. Information We Collect</strong></div><div>When you use AgriConnect, we may collect the following types of information:</div><div>● <strong>Personal Information:</strong> Name, email, phone number, location, and profile details when you register an account.</div><div>● <strong>Usage Data:</strong> Information about how you interact with the app, including pages visited, time spent, and features used.</div><div>● <strong>Device Information:</strong> Device type, operating system, IP address, and browser type for app functionality and security.</div><div>● <strong>Marketplace Data:</strong> If you are a vendor, we collect store details, product listings, transaction history, and customer interactions.</div><div><strong>2. How We Use Your Information</strong></div><div>We use your information to:</div><div>● Provide and improve AgriConnect’s features, including the learning portal and marketplace.</div><div>● Connect farmers with buyers, experts, and agricultural resources.</div><div>● Personalize your experience by suggesting relevant content and connections.</div><div>● Enhance security, detect fraud, and comply with legal obligations.</div><div>● Send important updates, notifications, and marketing communications (you can opt-out anytime).</div><div><strong>3. How We Share Your Information</strong></div><div>We do <strong>not</strong> sell or rent your personal information. However, we may share data with:</div><div>● <strong>Service Providers:</strong> Trusted third parties who help us operate, analyze, and secure the platform.</div><div>● <strong>Legal Authorities:</strong> If required by law to comply with legal obligations or protect user rights.</div><div>● <strong>Other Users:</strong> Vendors and buyers may see basic profile details during marketplace interactions.</div><div><strong>4. Data Security</strong></div><div>We implement strong security measures to protect your data, including encryption and secure storage. However, no online platform is completely secure, so please use AgriConnect responsibly.</div><div><strong>5. Your Rights &amp; Choices</strong></div><div>You have the right to:</div><div>● Access, update, or delete your personal information through your account settings.</div><div>● Disable notifications or opt out of marketing messages.</div><div>● Request account deletion by contacting us at <strong>[Support Email]</strong>.</div><div><strong>6. Third-Party Links &amp; Services</strong></div><div>AgriConnect may contain links to third-party websites or services. We are not responsible for their privacy practices, so please review their policies separately.</div><div><strong>7. Changes to This Policy</strong></div><div>We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised <strong>Effective Date</strong>. Continued use of the app after updates means you accept the new terms.</div><div><strong>8. Contact Us</strong></div><div>For questions or concerns about this Privacy Policy, please contact us at:📧 <strong>Email: wungko@gmail.com</strong>  📞<strong>Phone: +231 886566281</strong></div><div>&nbsp;</div>`;

export default function PrivacyPolicy() {
  const dynamicPrivacyPolicy = useAppSelector(state => state.app.privacyPolicy);
  const dispatch = useAppDispatch();
  const {width} = useWindowDimensions();

  useEffect(() => {
    if (!dynamicPrivacyPolicy) {
      fetchPrivacyPolicy()
        .then(result => {
          if (result) {
            dispatch(appActions.savePrivacyPolicy(result));
          }
        })
        .catch(console.log);
    }
  }, [dynamicPrivacyPolicy, dispatch]);

  const htmlContent = dynamicPrivacyPolicy || privacyPolicy;

  return (
    <View style={styles.container}>
      <Header goBack title="Privacy Policy" icons={false} />
      <ScrollView style={styles.scrollContainer}>
        {htmlContent && (
          <RenderHTML
            source={{html: htmlContent}}
            tagsStyles={tagsStyles}
            contentWidth={width}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    // paddingHorizontal: 20,
    // paddingVertical: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
});
