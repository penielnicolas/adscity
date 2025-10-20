import { defaultAvatar } from "../config";

export const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    avatar: defaultAvatar,
    isVerified: true,
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2025-06-01T12:00:00Z',
    lastUpdated: '2023-11-25T15:30:00Z',
    twoFactorEnabled: false,
    preferredLanguage: 'French',
    emailNotifications: true,
    smsNotifications: false,
    isProfilePublic: true,
    showPhoneNumber: false,
};

// Mock sessions data
export const sessionsData = [
    {
        id: 'sess_001',
        device: 'MacBook Pro',
        browser: 'Chrome 120.0.0',
        location: 'San Francisco, USA',
        ip: '192.168.1.1',
        lastActive: '2023-11-25T09:30:00.000Z',
        isCurrentDevice: true,
    },
    {
        id: 'sess_002',
        device: 'iPhone 14',
        browser: 'Safari 17.0',
        location: 'New York, USA',
        ip: '192.168.2.2',
        lastActive: '2023-11-24T18:45:00.000Z',
        isCurrentDevice: false,
    },
    {
        id: 'sess_003',
        device: 'Windows PC',
        browser: 'Firefox 119.0',
        location: 'Chicago, USA',
        ip: '192.168.3.3',
        lastActive: '2023-11-20T12:15:00.000Z',
        isCurrentDevice: false,
    },
];

// Mock login history
export const loginHistoryData = [
    {
        id: 'login_001',
        date: '2023-11-25T09:30:00.000Z',
        ip: '192.168.1.1',
        location: 'San Francisco, USA',
        device: 'MacBook Pro (Chrome)',
        status: 'success',
    },
    {
        id: 'login_002',
        date: '2023-11-24T18:45:00.000Z',
        ip: '192.168.2.2',
        location: 'New York, USA',
        device: 'iPhone 14 (Safari)',
        status: 'success',
    },
    {
        id: 'login_003',
        date: '2023-11-23T15:10:00.000Z',
        ip: '192.168.4.4',
        location: 'Moscow, Russia',
        device: 'Unknown Device',
        status: 'failed',
    },
    {
        id: 'login_004',
        date: '2023-11-20T12:15:00.000Z',
        ip: '192.168.3.3',
        location: 'Chicago, USA',
        device: 'Windows PC (Firefox)',
        status: 'success',
    },
];

// Mock subscriptions
export const subscriptionData = [
    {
        id: 'sub_001',
        name: 'Premium Plan',
        status: 'active',
        startDate: '2023-01-15T00:00:00.000Z',
        endDate: '2024-01-15T00:00:00.000Z',
        renewalDate: '2024-01-15T00:00:00.000Z',
        amount: 99.99,
        currency: 'USD',
        billingCycle: 'yearly',
    },
];

// Mock payment methods
export const paymentMethodsData = [
    {
        id: 'pm_001',
        type: 'credit_card',
        name: 'Visa ending in 4242',
        lastFour: '4242',
        expiryDate: '04/25',
        isDefault: true,
    },
    {
        id: 'pm_002',
        type: 'paypal',
        name: 'PayPal (alex.johnson@example.com)',
        isDefault: false,
    },
];

// Mock transactions
export const transactionsData = [
    {
        id: 'tx_001',
        date: '2023-11-15T10:30:00.000Z',
        amount: 99.99,
        currency: 'USD',
        description: 'Premium Plan - Annual Subscription',
        status: 'pending',
        method: 'Visa ending in 4242',
    },
    {
        id: 'tx_002',
        date: '2023-10-15T09:45:00.000Z',
        amount: 19.99,
        currency: 'USD',
        description: 'Add-on Service Fee',
        status: 'completed',
        method: 'PayPal',
    },
    {
        id: 'tx_003',
        date: '2023-09-15T14:20:00.000Z',
        amount: 99.99,
        currency: 'USD',
        description: 'Premium Plan - Annual Subscription',
        status: 'failed',
        method: 'Visa ending in 4242',
    },
];

// Mock support tickets
export const supportTicketsData = [
    {
        id: 'ticket_001',
        subject: 'Unable to update profile information',
        date: '2023-11-10T13:45:00.000Z',
        status: 'closed',
        lastUpdated: '2023-11-12T09:30:00.000Z',
        category: 'Account Issues',
    },
    {
        id: 'ticket_002',
        subject: 'Billing discrepancy on recent payment',
        date: '2023-10-28T15:20:00.000Z',
        status: 'in_progress',
        lastUpdated: '2023-11-01T11:15:00.000Z',
        category: 'Billing',
    },
    {
        id: 'ticket_003',
        subject: 'Feature request: Dark mode support',
        date: '2023-10-15T10:10:00.000Z',
        status: 'open',
        lastUpdated: '2023-10-15T10:10:00.000Z',
        category: 'Feature Request',
    },
];

// Mock security alerts
export const securityAlertsData = [
    {
        id: 'alert_001',
        date: '2023-11-23T15:10:00.000Z',
        type: 'login_attempt',
        description: 'Failed login attempt from unknown location (Moscow, Russia)',
        severity: 'high',
        isResolved: true,
    },
    {
        id: 'alert_002',
        date: '2023-11-05T09:30:00.000Z',
        type: 'password_change',
        description: 'Password was changed successfully',
        severity: 'low',
        isResolved: true,
    },
    {
        id: 'alert_003',
        date: '2023-10-20T13:45:00.000Z',
        type: 'suspicious_activity',
        description: 'Multiple failed login attempts detected',
        severity: 'medium',
        isResolved: false,
    },
];