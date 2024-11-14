
interface IUserAReturn {
    users: IUserA[];
    count: number;
    traceId: string;
}

interface IUserA {
    id: string;
    deleted: boolean;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    permissions: IPermissions;
    profilePhoto: string;
    roles: IRoles;
}

interface IPermissions {
    adPublishingEnabled: boolean;
    adPublishingReadOnly: boolean;
    adwordsReportingEnabled: boolean;
    affiliateManagerEnabled: boolean;
    agentReportingEnabled: boolean;
    appointmentsEnabled: boolean;
    assignedDataOnly: boolean;
    attributionsReportingEnabled: boolean;
    bloggingEnabled: boolean;
    botService: boolean;
    bulkRequestsEnabled: boolean;
    campaignsEnabled: boolean;
    campaignsReadOnly: boolean;
    cancelSubscriptionEnabled: boolean;
    certificatesEnabled: boolean;
    communitiesEnabled: boolean;
    contactsEnabled: boolean;
    contentAiEnabled: boolean;
    conversationsEnabled: boolean;
    customMenuLinkReadOnly: boolean;
    customMenuLinkWrite: boolean;
    dashboardStatsEnabled: boolean;
    aymentsEnabled: boolean;
    facebookAdsReportingEnabled: boolean;
    funnelsEnabled: boolean;
    invoiceEnabled: boolean;
    leadValueEnabled: boolean;
    marketingEnabled: boolean;
    mediaStorageEnabled: boolean;
    membershipEnabled: boolean;
    onlineListingsEnabled: boolean;
    opportunitiesEnabled: boolean;
    paymentsEnabled: boolean;
    phoneCallEnabled: boolean;
    recordPaymentEnabled: boolean;
    refundsEnabled: boolean;
    reportingEnabled: boolean;
    reviewsEnabled: boolean;
    settingsEnabled: boolean;
    socialPlanner: boolean;
    tagsEnabled: boolean;
    triggersEnabled: boolean;
    websitesEnabled: boolean;
    wordpressEnabled: boolean;
    workflowsEnabled: boolean;
    workflowsReadOnly: boolean;
}

interface IRoles {
    type: string;
    role: string;
    locationIds: string[];
    restrictSubAccount: boolean;
}