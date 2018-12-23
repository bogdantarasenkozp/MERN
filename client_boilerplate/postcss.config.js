module.exports = {
    plugins: [
        require('postcss-reporter')({ clearAllMessages: true }),
        require('postcss-cssnext')({
            browsers: '> 0.1%',
            url: false
        })
    ]
};
