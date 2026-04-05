import type { Lang } from "./i18n";

export type AdminDict = {
  brand: string;
  navHospitals: string;
  navPolicies: string;
  navDashboard: string;
  navCta: string;
  adminTitle: string;
  adminSubtitle: string;
  leadsTitle: string;
  leadsSubtitle: string;
  leadsExport: string;
  resourcesTitle: string;
  resourcesSubtitle: string;
  resourcesType: string;
  resourcesKeyword: string;
  search: string;
  noResources: string;
  tableId: string;
  tableName: string;
  tableEmail: string;
  tablePassport: string;
  tableIm: string;
  tableCreated: string;
  tableType: string;
  tableCity: string;
  tableStatus: string;
  tableContact: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  privacyTitle: string;
  privacyBody: string;
};

const zh: AdminDict = {
  brand: "跨境医疗",
  navHospitals: "医院",
  navPolicies: "政策",
  navDashboard: "管理后台",
  navCta: "免费评估预约",
  adminTitle: "管理后台",
  adminSubtitle: "仅供内部使用。访问数据需要正确配置管理密钥。",
  leadsTitle: "留资",
  leadsSubtitle: "最近 200 条提交记录",
  leadsExport: "导出 CSV",
  resourcesTitle: "资源库",
  resourcesSubtitle: "内部对接资源库，支持按名称/地址/联系人检索。",
  resourcesType: "类型",
  resourcesKeyword: "关键词",
  search: "搜索",
  noResources: "暂无资源",
  tableId: "编号",
  tableName: "姓名",
  tableEmail: "邮箱",
  tablePassport: "护照号",
  tableIm: "IM",
  tableCreated: "创建时间",
  tableType: "类型",
  tableCity: "城市",
  tableStatus: "状态",
  tableContact: "联系人",
  disclaimerTitle: "免责声明",
  disclaimerBody:
    "我们提供面向国际患者的医疗信息与就医协调服务，并非医疗机构，也不提供医疗诊断。最终医疗决策由具备执业资质的医院与医生作出。",
  privacyTitle: "隐私",
  privacyBody: "护照与病历属于敏感信息，请按需提供。你可以随时联系支持人员申请删除相关数据。"
};

const en: AdminDict = {
  brand: "Oversea Medical",
  navHospitals: "Hospitals",
  navPolicies: "Policies",
  navDashboard: "Dashboard",
  navCta: "Book Free Assessment",
  adminTitle: "Dashboard",
  adminSubtitle: "Internal use only. Admin API key is required for data access.",
  leadsTitle: "Leads",
  leadsSubtitle: "Latest 200 submissions.",
  leadsExport: "Export CSV",
  resourcesTitle: "Resources",
  resourcesSubtitle: "Internal partner resources. Search by name / address / contact.",
  resourcesType: "Type",
  resourcesKeyword: "Keyword",
  search: "Search",
  noResources: "No resources.",
  tableId: "ID",
  tableName: "Name",
  tableEmail: "Email",
  tablePassport: "Passport",
  tableIm: "IM",
  tableCreated: "Created",
  tableType: "Type",
  tableCity: "City",
  tableStatus: "Status",
  tableContact: "Contact",
  disclaimerTitle: "Disclaimer",
  disclaimerBody:
    "We provide medical coordination services and information for international patients. We are not a medical institution and do not provide medical diagnosis. Final medical decisions are made by licensed hospitals and doctors.",
  privacyTitle: "Privacy",
  privacyBody: "Please share passport and medical records only when necessary. You can request data deletion by contacting our support."
};

export function getAdminDict(lang: Lang): AdminDict {
  return lang === "zh" ? zh : en;
}

