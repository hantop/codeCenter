/**
 * Created by kiner on 2016-05-20.
 */
var menuData = [

    {
        id: "kinerMenuItem1",
        title: "菜单1",
        icon: "icon.png",
        action: function () {
        },
        disabled: false,//当前菜单项是否可点击
        subMenuShow: true,//是否展示子菜单，仅显示下一级的子菜单
        subMenus: [
            {
                title: "百度",
                icon: "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png",
                link: "https://www.baidu.com",
                beforeRender: function (ele, data, level) {

                },
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            },
            {
                title: "腾讯",
                icon: "https://ss1.bdstatic.com/9qV1bjeh1BF3odCf/zhanzhang/zzlogo/0f4424a95da670a4fd6086b361a6e9f1.jpg",
                link: "http://www.qq.com",
                beforeRender: function (ele, data, level) {

                },
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            },
            {
                title: "新浪",
                icon: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1507300743,2576533199&fm=58",
                link: "http://www.sina.com",
                beforeRender: function (ele, data, level) {

                },
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            },
            {
                title: "子菜单1",
                icon: "icon.png",
                action: function () {
                    console.log("点击子菜单");
                },
                beforeRender: function (ele, data, level) {

                },
                disabled: false,
                subMenuShow: true,
                subMenus: [
                    {
                        title: "子菜单1-1",
                        icon: "icon.png",
                        action: function () {
                            console.log("点击子菜单1-2");
                        },
                        disabled: false,
                        subMenus: [
                            {
                                title: "子菜单1-1-1",
                                icon: "icon.png",
                                action: function () {
                                    console.log("点击子菜单1-2");
                                },
                                disabled: false, subMenus: [
                                {
                                    title: "子菜单1-1-1-1",
                                    icon: "icon.png",
                                    action: function () {
                                        console.log("点击子菜单1-2");
                                    },
                                    disabled: false, subMenus: [
                                    {
                                        title: "子菜单1-1-1-1-1",
                                        icon: "icon.png",
                                        action: function () {
                                            console.log("点击子菜单1-2");
                                        },
                                        disabled: false, subMenus: [
                                        {
                                            title: "子菜单1-1-1-1-1-1",
                                            icon: "icon.png",
                                            action: function () {
                                                console.log("点击子菜单1-2");
                                            },
                                            disabled: false, subMenus: [
                                            {
                                                title: "子菜单1-1-1-1-1-1-1",
                                                icon: "icon.png",
                                                action: function () {
                                                    console.log("点击子菜单1-2");
                                                },
                                                disabled: false
                                            }, {
                                                title: "子菜单1-1-1-1-1-1-2",
                                                icon: "icon.png",
                                                action: function () {
                                                    console.log("点击子菜单1-2");
                                                },
                                                disabled: false
                                            }, {
                                                title: "子菜单1-1-1-1-1-1-3",
                                                icon: "icon.png",
                                                action: function () {
                                                    console.log("点击子菜单1-2");
                                                },
                                                disabled: false
                                            }
                                        ]
                                        }
                                    ]
                                    }
                                ]
                                }
                            ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "菜单2",
        icon: "icon.png",
        action: function (ele, data, parentData, link) {
            console.log(arguments);
        },
        disabled: false,
        beforeRender: function (ele, data, level) {
            ele.innerHTML = "菜单（" + level + "）";
            return ele;
        },
        subMenus: [
            {
                title: "子菜单2-1",
                icon: "icon.png",
                action: function (ele, data, parentData) {
                    console.log(arguments);
                },
                disabled: false,
                subMenus: [
                    {
                        title: "百度",
                        icon: "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png",
                        link: "https://www.baidu.com",
                        beforeRender: function (ele, data, level) {

                        },
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    },
                    {
                        title: "腾讯",
                        icon: "https://ss1.bdstatic.com/9qV1bjeh1BF3odCf/zhanzhang/zzlogo/0f4424a95da670a4fd6086b361a6e9f1.jpg",
                        link: "http://www.qq.com",
                        beforeRender: function (ele, data, level) {

                        },
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    },
                    {
                        title: "新浪",
                        icon: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1507300743,2576533199&fm=58",
                        link: "http://www.sina.com",
                        beforeRender: function (ele, data, level) {

                        },
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    }
                ]
            }, {
                title: "子菜单2-2",
                icon: "icon.png",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            }, {
                title: "子菜单2-3",
                icon: "icon.png",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            }, {
                title: "子菜单2-4",
                icon: "icon.png",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false,
                subMenus: [
                    {
                        title: "子菜单2-4-1",
                        icon: "icon.png",
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    },
                    {
                        title: "子菜单2-4-2",
                        icon: "icon.png",
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    },
                    {
                        title: "子菜单2-4-3",
                        icon: "icon.png",
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    }
                ]
            }, {
                title: "子菜单2-5",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            }, {
                title: "子菜单2-6",
                icon: "",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            }
        ]
    }

];
var menuData2 = [


    {
        id: "kinerMenuItem2",
        title: "菜单1",
        icon: "icon.png",
        action: function () {
        },
        disabled: false,//当前菜单项是否可点击
        subMenuShow: true,//是否展示子菜单，仅显示下一级的子菜单
        subMenus: [
            {
                title: "百度2",
                icon: "icon.png",
                link: "https://www.baidu.com",
                beforeRender: function (ele, data, level) {

                },
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            },
            {
                title: "腾讯2",
                icon: "icon.png",
                link: "http://www.qq.com",
                beforeRender: function (ele, data, level) {

                },
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            },
            {
                title: "新浪2",
                icon: "icon.png",
                link: "http://www.sina.com",
                beforeRender: function (ele, data, level) {

                },
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            },
            {
                title: "子菜单1",
                icon: "icon.png",
                action: function () {
                    console.log("点击子菜单");
                },
                beforeRender: function (ele, data, level) {

                },
                disabled: false,
                subMenuShow: true,
                subMenus: [
                    {
                        title: "子菜单1-1",
                        icon: "icon.png",
                        action: function () {
                            console.log("点击子菜单1-2");
                        },
                        disabled: false,
                        subMenus: [
                            {
                                title: "子菜单1-1-1",
                                icon: "icon.png",
                                action: function () {
                                    console.log("点击子菜单1-2");
                                },
                                disabled: false, subMenus: [
                                {
                                    title: "子菜单1-1-1-1",
                                    icon: "icon.png",
                                    action: function () {
                                        console.log("点击子菜单1-2");
                                    },
                                    disabled: false, subMenus: [
                                    {
                                        title: "子菜单1-1-1-1-1",
                                        icon: "icon.png",
                                        action: function () {
                                            console.log("点击子菜单1-2");
                                        },
                                        disabled: false, subMenus: [
                                        {
                                            title: "子菜单1-1-1-1-1-1",
                                            icon: "icon.png",
                                            action: function () {
                                                console.log("点击子菜单1-2");
                                            },
                                            disabled: false, subMenus: [
                                            {
                                                title: "子菜单1-1-1-1-1-1-1",
                                                icon: "icon.png",
                                                action: function () {
                                                    console.log("点击子菜单1-2");
                                                },
                                                disabled: false
                                            }, {
                                                title: "子菜单1-1-1-1-1-1-2",
                                                icon: "icon.png",
                                                action: function () {
                                                    console.log("点击子菜单1-2");
                                                },
                                                disabled: false
                                            }, {
                                                title: "子菜单1-1-1-1-1-1-3",
                                                icon: "icon.png",
                                                action: function () {
                                                    console.log("点击子菜单1-2");
                                                },
                                                disabled: false
                                            }
                                        ]
                                        }
                                    ]
                                    }
                                ]
                                }
                            ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "菜单2",
        icon: "icon.png",
        action: function (ele, data, parentData, link) {
            console.log(arguments);
        },
        disabled: false,
        beforeRender: function (ele, data, level) {

            ele.innerHTML = "菜单（" + level + "）";
            return ele;
        },
        subMenus: [
            {
                title: "子菜单2-1",
                icon: "icon.png",
                action: function (ele, data, parentData) {
                    console.log(arguments);
                },
                disabled: false,
                subMenus: [
                    {
                        title: "百度",
                        icon: "icon.png",
                        link: "https://www.baidu.com",
                        beforeRender: function (ele, data, level) {

                        },
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    },
                    {
                        title: "腾讯",
                        icon: "icon.png",
                        link: "http://www.qq.com",
                        beforeRender: function (ele, data, level) {

                        },
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    },
                    {
                        title: "新浪",
                        icon: "icon.png",
                        link: "http://www.sina.com",
                        beforeRender: function (ele, data, level) {

                        },
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    }
                ]
            }, {
                title: "子菜单2-2",
                icon: "icon.png",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            }, {
                title: "子菜单2-3",
                icon: "icon.png",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            }, {
                title: "子菜单2-4",
                icon: "icon.png",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false,
                subMenus: [
                    {
                        title: "子菜单2-4-1",
                        icon: "icon.png",
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    },
                    {
                        title: "子菜单2-4-2",
                        icon: "icon.png",
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    },
                    {
                        title: "子菜单2-4-3",
                        icon: "icon.png",
                        action: function () {
                            console.log("点击子菜单2");
                        },
                        disabled: false
                    }
                ]
            }, {
                title: "子菜单2-5",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            }, {
                title: "子菜单2-6",
                icon: "",
                action: function () {
                    console.log("点击子菜单2");
                },
                disabled: false
            }
        ]
    }

];