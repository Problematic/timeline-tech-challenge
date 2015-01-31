requirejs.config({
    baseUrl: 'js',
    paths: {
        text: 'lib/text.require',
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min'
    }
});

requirejs(['app']);
