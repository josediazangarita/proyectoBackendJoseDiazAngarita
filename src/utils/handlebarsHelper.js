import handlebars from 'handlebars';

handlebars.registerHelper('eq', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

handlebars.registerHelper('or', function (v1, v2, options) {
    if (v1 === v2[0] || v1 === v2[1]) {
        return options.fn(this);
    }
    return options.inverse(this);
});

handlebars.registerHelper('array', function (...args) {
    return args.slice(0, -1);
});