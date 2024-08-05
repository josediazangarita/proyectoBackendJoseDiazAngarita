import handlebars from 'handlebars';

handlebars.registerHelper('eq', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

handlebars.registerHelper('or', function (v1, v2Array, options) {
    if (v2Array.includes(v1)) {
        return options.fn(this);
    }
    return options.inverse(this);
});

handlebars.registerHelper('array', function (...args) {
    return args.slice(0, -1);
});