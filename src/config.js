// Configuration file for payment API
// WARNING: This file contains INTENTIONAL security issues for testing

const config = {
  // AWS Credentials - INTENTIONAL VULNERABILITY FOR TESTING
  aws: {
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region: 'us-east-1'
  },

  // Stripe API Key - INTENTIONAL VULNERABILITY FOR TESTING
  stripe: {
    secretKey: 'sk_live_51HvTNVEXAMPLEKEY123456789abcdefghijklmnopqrstuvwxyz',
    publishableKey: 'pk_live_51HvTNVEXAMPLEKEY987654321zyxwvutsrqponmlkjihgfedcba'
  },

  // GitHub Token - INTENTIONAL VULNERABILITY FOR TESTING
  github: {
    token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },

  // Google API Key - INTENTIONAL VULNERABILITY FOR TESTING
  google: {
    apiKey: 'AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI'
  },

  // Database credentials - INTENTIONAL VULNERABILITY FOR TESTING
  database: {
    host: 'production-db.example.com',
    port: 5432,
    username: 'admin',
    password: 'SuperSecretPassword123!'
  },

  // JWT Secret - INTENTIONAL VULNERABILITY FOR TESTING
  jwt: {
    secret: 'my-super-secret-jwt-signing-key-that-should-not-be-here'
  },

  // Private key inline - INTENTIONAL VULNERABILITY FOR TESTING
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0Z3US4rNM5i3z9SAMPLE_KEY_NOT_REAL_DATA_FOR_TESTING
aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789EXAMPLE_PRIVATE_KEY_DATA_ONLY
THIS_IS_INTENTIONALLY_FAKE_DATA_FOR_SECURITY_SCANNING_TESTING
-----END RSA PRIVATE KEY-----`
};

module.exports = config;
