import {DefaultTheme} from 'vitepress'

const commonSidebars: LSidebar = {
  '/api/effector-react': [
    {
      text: {en: 'Hooks'},
      items: [
        {
          text: {en: 'useUnit'},
          link: '/api/effector-react/useUnit',
        },
        {
          text: {en: 'useList'},
          link: '/api/effector-react/useList',
        },
        {
          text: {en: 'useStoreMap'},
          link: '/api/effector-react/useStoreMap',
        },
        {
          text: {en: 'useStore'},
          link: '/api/effector-react/useStore',
        },
        {
          text: {en: 'useEvent'},
          link: '/api/effector-react/useEvent',
        },
      ],
    },
    {
      text: {en: 'Gates'},
      items: [
        {
          text: {en: 'Gate'},
          link: '/api/effector-react/Gate',
        },
        {
          text: {en: 'createGate'},
          link: '/api/effector-react/createGate',
        },
        {
          text: {en: 'useGate'},
          link: '/api/effector-react/useGate',
        },
      ],
    },
    {
      text: {en: 'HOC-like APIs'},
      collapsed: true,
      items: [
        {
          text: {en: 'connect'},
          link: '/api/effector-react/connect',
        },
        {
          text: {en: 'createComponent'},
          link: '/api/effector-react/createComponent',
        },
        {
          text: {en: 'createStoreConsumer'},
          link: '/api/effector-react/createStoreConsumer',
        },
      ],
    },
  ],

  '/api/effector-solid': [],
  '/api/effector-vue': [],

  '/api/effector': [
    {
      text: {en: 'Unit Types'},
      items: [
        {
          text: {en: 'Event'},
          link: '/api/effector/Event',
        },
        {
          text: {en: 'Store'},
          link: '/api/effector/Store',
        },
        {
          text: {en: 'Effect'},
          link: '/api/effector/Effect',
        },
        {
          text: {en: 'Domain'},
          link: '/api/effector/Domain',
        },
        {
          text: {en: 'Scope'},
          link: '/api/effector/Scope',
        },
      ],
    },
    {
      text: {en: 'Methods'},
      items: [
        {
          text: {en: 'createStore'},
          link: '/api/effector/createStore',
        },
        {
          text: {en: 'createEvent'},
          link: '/api/effector/createEvent',
        },
        {
          text: {en: 'createEffect'},
          link: '/api/effector/createEffect',
        },
        {
          text: {en: 'createDomain'},
          link: '/api/effector/createDomain',
        },
        {
          text: {en: 'createApi'},
          link: '/api/effector/createApi',
        },
        {
          text: {en: 'attach'},
          link: '/api/effector/attach',
        },
        {
          text: {en: 'combine'},
          link: '/api/effector/combine',
        },
        {
          text: {en: 'forward'},
          link: '/api/effector/forward',
        },
        {
          text: {en: 'fromObservable'},
          link: '/api/effector/fromObservable',
        },
        {
          text: {en: 'guard'},
          link: '/api/effector/guard',
        },
        {
          text: {en: 'merge'},
          link: '/api/effector/merge',
        },
        {
          text: {en: 'restore'},
          link: '/api/effector/restore',
        },
        {
          text: {en: 'sample'},
          link: '/api/effector/sample',
        },
        {
          text: {en: 'split'},
          link: '/api/effector/split',
        },
      ],
    },
    {
      text: {en: 'Fork API'},
      collapsed: true,
      items: [
        {
          text: {en: 'fork'},
          link: '/api/effector/fork',
        },
        {
          text: {en: 'serialize'},
          link: '/api/effector/serialize',
        },
        {
          text: {en: 'allSettled'},
          link: '/api/effector/allSettled',
        },
        {
          text: {en: 'hydrate'},
          link: '/api/effector/hydrate',
        },
        {
          text: {en: 'scopeBind'},
          link: '/api/effector/scopeBind',
        },
      ],
    },
    {
      text: {en: 'Utilities'},
      collapsed: true,
      items: [
        {
          text: {en: 'is'},
          link: '/api/effector/is',
        },
      ],
    },
    {
      text: {en: 'Low-level API'},
      collapsed: true,
      items: [
        {
          text: {en: 'clearNode'},
          link: '/api/effector/clearNode',
        },
        {
          text: {en: 'withRegion'},
          link: '/api/effector/withRegion',
        },
        {
          text: {en: 'launch'},
          link: '/api/effector/launch',
        },
      ],
    },
    {
      text: {en: 'Compiler Plugins'},
      items: [
        {
          text: {en: 'Babel plugin'},
          link: '/api/effector/babel-plugin',
        },
        {
          text: {en: 'SWC plugin'},
          link: 'https://github.com/effector/swc-plugin',
        },
      ],
    },
  ],

  '/': [
    {
      text: {en: 'Introduction', ru: 'Начало работы'},
      items: [
        {
          text: {en: 'Motivation'},
          link: '/introduction/motivation',
        },
        {
          text: {en: 'Community'},
          link: '/introduction/community',
        },
        {
          text: {en: 'Installation', ru: 'Установка'},
          link: '/introduction/installation',
        },
        {
          text: {en: 'Ecosystem', ru: 'Экосистема effector'},
          link: '/introduction/ecosystem',
        },
        {
          text: {en: 'Examples', ru: 'Примеры'},
          link: '/introduction/examples',
        },
      ],
    },
    {
      text: {en: 'Conventions', ru: 'Соглашения'},
      items: [
        {
          text: {en: 'Naming'},
          link: '/conventions/naming',
        },
      ],
    },
    {
      text: {en: 'TypeScript Guide', ru: 'Использование с TypeScript'},
      items: [
        {
          text: {en: 'Typing effector', ru: 'Типизация effector'},
          link: '/typescript/typing-effector',
        },
        {
          text: {en: 'Usage with `effector-react`'},
          link: '/typescript/usage-with-effector-react',
        },
        {
          text: {en: 'Utility Types', ru: 'Служебные типы'},
          link: '/typescript/utility-types',
        },
      ],
    },
    {
      text: {en: 'Explanation', ru: 'Погружение'},
      items: [
        {
          text: {en: 'Glossary', ru: 'Глоссарий'},
          link: '/explanation/glossary',
        },
        {
          text: {en: 'Computation Priority'},
          link: '/explanation/computation-priority',
        },
        {
          text: {en: 'Prior Art', ru: 'Prior Art'},
          link: '/explanation/prior-art',
        },
      ],
    },
  ],
}

interface LText {
  en: string
  ru?: string
  'zh-cn'?: string
}

interface LSidebar {
  [path: string]: LSidebarGroup[]
}

interface LSidebarGroup {
  text: LText
  items: LSidebarItem[]
  collapsed?: boolean
}

type LSidebarItem = {text: LText; link: string}

function makeLocalizedSidebar(
  sidebar: LSidebar,
  locales: Array<keyof LText>, // [ru, zh-cn]
  mainLocale: keyof LText, // en
): DefaultTheme.Sidebar {
  const convertedSidebar: DefaultTheme.Sidebar = {}

  locales.forEach(locale => {
    Object.keys(sidebar).forEach(sidebarPath => {
      convertedSidebar[`/${locale}${sidebarPath}`] = localizeSidebarGroups(
        sidebar[sidebarPath],
        locale,
        mainLocale,
      )
    })
  })

  Object.keys(sidebar).forEach(sidebarPath => {
    convertedSidebar[sidebarPath] = localizeSidebarGroups(
      sidebar[sidebarPath],
      mainLocale,
      mainLocale,
    )
  })

  return convertedSidebar
}

function localizeSidebarGroups(
  groups: LSidebarGroup[],
  locale: keyof LText,
  mainLocale: keyof LText,
): DefaultTheme.SidebarGroup[] {
  return groups.map<DefaultTheme.SidebarGroup>(group => {
    const text = group.text[locale] ?? group.text[mainLocale]
    const items = group.items.map<DefaultTheme.SidebarItem>(item => {
      const text =
        item.text[locale] ?? `${item.text[mainLocale]} (${mainLocale})`
      const link =
        locale in item.text && locale !== mainLocale
          ? `/${locale}${item.link}`
          : item.link
      return {text, link}
    })
    return {
      text,
      items,
      collapsed: group.collapsed,
      collapsible: group.collapsed,
    }
  })
}

export const sidebar = makeLocalizedSidebar(
  commonSidebars,
  ['ru', 'zh-cn'],
  'en',
)
