import type { CardListData, FooterConfig, IntegrationConfig, MenuLinks, SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  // === Required meta properties ===
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: 'ice',
  // Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
  title: 'ice 的博客',
  // Meta property used to generate your sitemap and canonical URLs in your final build
  site: 'https://astro-pure-blog.vercel.app',
  // Meta property used as the default description meta property
  description: '记录想法、项目与日常',
  // HTML lang property, found in src/layouts/Base.astro L:18
  lang: 'zh-CN',
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: 'zh_CN',
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: 'zh-CN',
    options: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },

  // Mirror (remove ending trailing slash)
  npmCDN: 'https://cdn.jsdelivr.net/npm',
  // Recommend:
  // - https://cdn.jsdelivr.net/npm
  // - https://cdn.smartcis.cn/npm
  // - https://unkpg.com
  // - https://cdn.cbd.int
  // - https://esm.sh

  // === Customize options ===
  blog: {
    pageSize: 8 // blog page size for pagination
  },

  seo: {
    // Telegram channel (Only to link with telegram instant view.
    // If you don't know what it is, you can ignore it)
    // telegramChannel: '@cworld0_cn'
  },
  content: {
    externalLinkArrow: true, // show external link arrow
    // Currently support weibo, x, bluesky
    share: ['weibo', 'x', 'bluesky']
  }
}

// Footer configuration, which contains the registration and social links
// and will be used in Footer.astro
export const footerConfig: FooterConfig = {
  // Registration information for ICP (optional)
  registration: {
    url: '',
    text: ''
  },
  socialLinks: [
    // {
    //   name: 'mail',
    //   url: 'mailto:test@example.com'
    // },
    {
      name: 'github',
      url: 'https://github.com/ice-creator-new/astro-pure-blog'
    }
  ]
}

export const integrationConfig: IntegrationConfig = {
  // Comment system
  waline: {
    enable: false,
    // Server service link
    server: 'https://astro-theme-pure-waline.arthals.ink/',
    // Refer https://waline.js.org/en/guide/features/emoji.html
    emoji: ['bmoji', 'weibo'],
    // Refer https://waline.js.org/en/reference/client/props.html
    additionalConfigs: {
      // search: false,
      pageview: true,
      comment: true,
      locale: {
        reaction0: 'Like',
        placeholder: 'Welcome to comment. (Email to receive replies. Login is unnecessary)'
      },
      imageUploader: false
    }
  },
  links: {
    // Friend logbook
    logbook: [
      { date: '2024-07-01', content: 'Lorem ipsum dolor sit amet.' },
      { date: '2024-07-01', content: 'vidit suscipit at mei.' },
      { date: '2024-07-01', content: 'Quem denique mea id.' }
    ],
    // Yourself link info
    applyTip: {
      name: siteConfig.title,
      desc: siteConfig.description,
      url: siteConfig.site,
      avatar: siteConfig.site + 'favicon/favicon.ico'
    }
  },
  // Tailwindcss typography
  typography: {
    // https://github.com/tailwindlabs/tailwindcss-typography
    class: 'prose prose-pure dark:prose-invert dark:prose-pure prose-headings:font-medium'
  },
  // A lightbox library that can add zoom effect
  mediumZoom: {
    enable: true, // disable it will not load the whole library
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // Add a random quote to the footer (default on homepage footer)
  quote: {
    // https://developer.hitokoto.cn/sentence/
    server: 'https://v1.hitokoto.cn/?c=i',
    target: (data) => (data as { hitokoto: string }).hitokoto || 'Error'
  }
}

export const menuLinks: MenuLinks = [
  {
    link: '/blog',
    label: '文章'
  },
  {
    link: '/projects',
    label: '项目'
  },
  {
    link: '/about',
    label: '关于'
  }
]

export const terms: CardListData = {
  title: '条款',
  list: [
    {
      title: '隐私政策',
      link: '/terms/privacy-policy'
    },
    {
      title: '服务条款',
      link: '/terms/terms-and-conditions'
    },
    {
      title: '版权声明',
      link: '/terms/copyright'
    },
    {
      title: '免责声明',
      link: '/terms/disclaimer'
    }
  ]
}
