export interface Subsection {
  name: string
  path: string
  roles?: string[]
}

export interface Section {
  name: string
  path: string
  subsections: Subsection[]
  roles?: string[]
}

const sectionsData: Record<string, Section> = {
  // PIM: {
  //   name: 'PIM',
  //   path: '/pim',
  //   subsections: [{ name: 'PIM', path: '/pim' }]
  // },
  // PimLab: {
  //   name: 'PIMLAB',
  //   path: '/pim-lab',
  //   subsections: [{ name: 'PIMLAB', path: '/pim-lab' }]
  // },
  CMS: {
  name: 'CMS',
  path: '/cms/bloggers',
  subsections: [
    { name: 'Бюджет', path: '/cms/budget' },
    { name: 'Превышение', path: '/cms/overlimit' },
    { name: 'Блогеры', path: '/cms/bloggers' },
    { name: 'Публикации', path: '/cms/publications' },
  ],
},
  DMS: {
    name: 'DMS',
    path: '/dms/offers',
    subsections: [
      { name: 'Заявки', path: '/dms/offers' },
      { name: 'Контрагенты менеджер', path: '/dms/partnersManager' },
      { name: 'Контрагенты ДО', path: '/dms/partnersDoc' },
    ],
    roles: ['admin', 'manager_do', 'admin_do'],
  },
  // DMS: {
  //   name: 'DMS',
  //   path: '/dms',
  //   subsections: [{ name: 'DMS', path: '/dms' }]
  // },
  SpecialProjects: {
    name: 'Special Projects',
    path: '/special-projects/operations',
    subsections: [
      { name: 'Операции по складу', path: '/special-projects/operations' },
      { name: 'Остатки', path: '/special-projects/leftovers' },
      { name: 'DBF', path: '/special-projects/dbf' },
    ],
    roles: ['admin', 'barcode_scanner_viewer', 'dbf_manager'],
  },
  // PRM: {
  //   name: 'PRM',
  //   path: '/prm',
  //   subsections: [{ name: 'PRM', path: '/prm' }]
  // },
  CustomerService: {
    name: 'Customer Service',
    path: '/support/supportChat',
    subsections: [{ name: 'Служба поддержки', path: '/support/supportChat' }],
    roles: ['admin', 'support'],
  },
  DAS: {
    name: 'DAS',
    path: '/das/requests',
    subsections: [
      { name: 'Все заявки', path: '/das/requests' },
      { name: 'Создать заявку', path: '/das/request/new' },
      // { name: 'Согласовать', path: '/das/approve' },
      // { name: 'Цепочки согласования', path: '/das/approvalChains' },
      // { name: 'Мои шаблоны', path: '/das/myTemplates' },
      { name: 'Поиск', path: '/das/search' },
    ],
  },
  // SmartAnalytics: {
  //   name: 'Smart Analytics',
  //   path: '/smart-analytics',
  //   subsections: [{ name: 'Smart Analytics', path: '/smart-analytics' }]
  // },
  // Design: {
  //   name: 'Design',
  //   path: '/design',
  //   subsections: [{ name: 'Design', path: '/design' }],
  // },
}

const sections: Map<string, Section> = new Map([
  ...Object.entries(sectionsData),
  [
    'Backoffice',
    {
      name: 'Backoffice',
      path: '/backoffice',
      subsections: [        ...Object.values(sectionsData).map((section) => ({
          name: section.name,
          path: section.path,
        })),
      ],
    },
  ],
])

export default sections
