export default {
  path: '/diploma',
  name: 'diploma',
  icon: 'BookOutlined',
  access: 'canDiplomaView',
  routes: [
    {
      path: '/diploma',
      redirect: '/diploma/book',
    },
    {
      name: 'diploma.book',
      icon: 'BookOutlined',
      path: '/diploma/book',
      component: './diploma/book',
      access: 'canDiplomaAdmin',
    },
    {
      name: 'diploma.decision',
      icon: 'FileTextOutlined',
      path: '/diploma/decision',
      component: './diploma/decision',
      access: 'canDiplomaAdmin',
    },
    {
      name: 'diploma.field',
      icon: 'FormOutlined',
      path: '/diploma/field',
      component: './diploma/field',
      access: 'canDiplomaAdmin',
    },
    {
      name: 'diploma.info',
      icon: 'ProfileOutlined',
      path: '/diploma/info',
      component: './diploma/info',
      access: 'canDiplomaAdmin',
    },
    {
      name: 'diploma.search',
      icon: 'SearchOutlined',
      path: '/diploma/search',
      component: './diploma/search',
      access: 'canDiplomaView',
    },
  ],
}; 