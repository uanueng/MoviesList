// ref: https://umijs.org/config/
export default {
    treeShaking: true,
    routes: [
        {
            path: '/',
            component: '../layouts/home',
            routes: [
                {path: '/', component: '../pages/home/index'}
            ]
        }
    ],
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: false,
            title: 'MoviesList',
            dll: false,

            routes: {
                exclude: [
                    /models\//,
                    /services\//,
                    /model\.(t|j)sx?$/,
                    /service\.(t|j)sx?$/,
                    /components\//,
                ],
            },
        }],
    ],

}
