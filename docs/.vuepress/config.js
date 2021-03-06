function i18N(language, str) {
    if (language == "en") {
        return str;
    }
    var l = {
        "zh": {
            "Offical Modules": "官方模块",
            "From Community": "来自社区"
        }
    }
    return l[language][str];
}

function sidebar(prefix) {
    var result = {};

    result["/" + prefix + "/guide/"] = [
        "introduction",
        "quick-start",
        "advanced-config",
        "modules",
    ]

    result["/" + prefix + "/modules/"] = [{
            title: i18N(prefix, "Offical Modules"),
            collapsable: false,
            children: [
                "webpack-entry",
                "export"
            ]
        },
        {
            title: i18N(prefix, "From Community"),
            collapsable: false,
            children: [
                "community-modules"
            ]
        }
    ]

    return Object.assign({}, result);
}

module.exports = {
    head: [
        ["script", {
            src: "http://tajs.qq.com/stats?sId=65846734"
        }]
    ],
    plugins: [
        '@vuepress/active-header-links',
        '@vuepress/back-to-top',
        '@vuepress/nprogress'
    ],
    title: "Qi Auto",
    description: "A tool help you generate config object based on directory structure for webpack, rollup, parcel, vue-router, etc.",
    base: "/qi-auto/",
    locales: {
        "/en/": {
            lang: "en-US",
        },
        "/zh/": {
            lang: "zh-CN",
            title: "Qi Auto",
            description: "一个根据目录结构帮你生成 webpack、rollup、parcel、vue-router 等配置对象的工具。",
        }
    },
    themeConfig: {
        displayAllHeaders: true,
        docsDir: 'docs',
        editLinks: true,
        repo: 'https://github.com/SaekiRaku/qi-auto',
        repoLabel: 'GitHub',


        locales: {
            "/en/": {
                label: "English",
                editLinkText: 'Help us improve this page!',
                lastUpdated: 'Last Updated',
                sidebar: sidebar("en"),
                nav: [{
                        text: "Guide",
                        link: "/en/guide/"
                    },
                    {
                        text: "Modules",
                        link: "/en/modules/"
                    }
                ]
            },
            "/zh/": {
                title: "Qi Auto",
                description: "一个根据目录结构帮你生成 webpack、rollup、parcel、vue-router 等配置对象的工具。",
                label: "简体中文",
                selectText: "选择语言",
                editLinkText: '帮助我们改善此页面！',
                repoLabel: '查看源码',
                lastUpdated: '上次更新时间',
                sidebar: sidebar("zh"),
                nav: [{
                        text: "入门指南",
                        link: "/zh/guide/introduction.md"
                    },
                    {
                        text: "模块",
                        link: "/zh/modules/"
                    }
                ]
            }
        }
    }
}